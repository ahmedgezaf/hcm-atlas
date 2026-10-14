# Running Moon Learning on Oracle Cloud Infrastructure

> **New to this?** There is a plain-language, tick-as-you-go walkthrough that
> covers Netlify, GitHub Pages and Oracle Cloud, with the jargon explained:
> https://claude.ai/code/artifact/bea275ac-eaff-4540-9545-6ab0e4c49efc
>
> This file is the reference version: terser, and OCI only.

The site is one static file — `dist/index.html`, about 595 KB, no server-side
anything. That makes every OCI route straightforward; the only real decision is
whether you want a custom domain and HTTPS.

Build first, always:

```bash
python3 build.py
```

| Route | Custom domain + HTTPS | Cost on Always Free | Effort |
| --- | --- | --- | --- |
| **1. Object Storage bucket** | No (long OCI URL) | Free within the 20 GB / 50k requests allowance | 2 minutes |
| **2. Object Storage + Load Balancer** | Yes | Flexible LB has an Always Free shape (10 Mbps); check your tenancy | 30 minutes |
| **3. Compute VM + nginx** | Yes | Free on an Always Free shape | 20 minutes |
| **4. Container Instances / OKE** | Yes | Not free | 20 minutes |

For a study site you want to send people to, **route 3** is the one to pick.
For "I just want a link right now", **route 1**.

---

## 1. Object Storage — fastest

```bash
./deploy/oci-object-storage.sh -c ocid1.compartment.oc1..xxxxx
```

The script creates a public-read bucket if it does not exist, uploads
`dist/index.html`, and prints the URL. Re-run it after every rebuild.

Two things that trip people up, both handled in the script:

- **Content-Type.** Upload without `--content-type "text/html; charset=utf-8"`
  and Object Storage serves `application/octet-stream`, so the browser
  downloads the file instead of rendering it.
- **No directory index.** Object Storage does not resolve `/` to `index.html`.
  The working URL always ends in the object name:
  `https://objectstorage.<region>.oraclecloud.com/n/<namespace>/b/hcm-atlas/o/index.html`

If you would rather not make the bucket public, `-p` keeps it private and issues
a 30-day pre-authenticated request instead — an unguessable link, no sign-in,
expires on its own.

Manually, the same thing is:

```bash
oci os ns get
oci os bucket create --compartment-id <ocid> --name hcm-atlas --public-access-type ObjectRead
oci os object put --bucket-name hcm-atlas --name index.html --file dist/index.html \
  --content-type "text/html; charset=utf-8" --force
```

## 2. Object Storage behind a Load Balancer — adds a domain

Keeps the bucket as the origin and puts a real hostname and certificate in
front. In the console: create a **Flexible Load Balancer** in a public subnet,
add a backend set pointing at
`objectstorage.<region>.oraclecloud.com:443` with SSL enabled, and add a rule
set that rewrites the incoming path to
`/n/<namespace>/b/hcm-atlas/o/index.html`. Attach a certificate (bring your own,
or use OCI Certificates), then point your domain's A record at the LB's public
IP.

The path rewrite is the fiddly part, and it is the reason most people skip
straight to route 3 for a single-file site.

## 3. Compute VM + nginx — the one to use for a real site

Create the instance:

- Shape: **VM.Standard.A1.Flex** (Ampere, 1 OCPU / 6 GB is plenty) or
  **VM.Standard.E2.1.Micro**. Both are Always Free eligible, subject to
  capacity in your region.
- Image: **Oracle Linux 9**.
- Networking: assign a public IPv4 address.
- Under *Show advanced options → Management → Initialization script*, paste
  [`cloud-init.yaml`](cloud-init.yaml).

Then open port 80/443 **in two places** — this is the step that catches almost
everyone:

1. **VCN security list or NSG** — add an ingress rule, source `0.0.0.0/0`,
   TCP, destination ports 80 and 443.
2. **The host firewall** — OCI's Linux images ship with iptables/firewalld
   rules that drop 80/443 regardless of what the security list says. The
   cloud-init file already runs `firewall-cmd --add-service=http/https`, so this
   is handled if you used it. If you did not:

   ```bash
   sudo firewall-cmd --permanent --add-service=http --add-service=https
   sudo firewall-cmd --reload
   ```

Upload the built page:

```bash
scp dist/index.html opc@<public-ip>:/tmp/index.html
ssh opc@<public-ip> 'sudo install -m 644 /tmp/index.html /var/www/hcm-atlas/index.html && sudo restorecon -v /var/www/hcm-atlas/index.html'
```

Add HTTPS once the domain's A record points at the instance:

```bash
sudo dnf install -y certbot python3-certbot-nginx
sudo certbot --nginx -d atlas.example.com
```

Redeploying later is just the `scp` line again — nginx is set to revalidate
`index.html` rather than cache it, so a refresh picks up the new build.

## 4. Container Instances / OKE

```bash
python3 build.py
docker build -f deploy/Dockerfile -t hcm-atlas .
docker tag  hcm-atlas <region>.ocir.io/<namespace>/hcm-atlas:latest
docker push <region>.ocir.io/<namespace>/hcm-atlas:latest
```

The image is `nginx-unprivileged` listening on **8080** as a non-root user,
which is what Container Instances and OKE's default security context expect.
Push to OCI Container Registry, then create a Container Instance from that image
with port 8080 exposed, or apply a Deployment plus a LoadBalancer Service on
OKE.

Note that a Container Instance is not covered by Always Free, so for a static
page this only makes sense if you are already running containers on OCI.

---

## Keeping it up to date

None of these routes rebuild for you. The GitHub Actions workflow in
`.github/workflows/pages.yml` deploys to GitHub Pages on push; to deploy to OCI
from CI instead, add a job that installs the OCI CLI, writes the config and key
from repository secrets, and runs `deploy/oci-object-storage.sh` (route 1) or
`scp`s to the instance (route 3).

Whatever you choose, `python3 build.py` has to run first — `dist/` is generated,
and CI fails the build if the committed copy is stale.
