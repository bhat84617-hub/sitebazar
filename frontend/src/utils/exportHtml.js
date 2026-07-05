const NEU_CSS = `
:root{--bg:#e4e9f0;--sl:#ffffff;--sd:#b7bcc7;--ink:#4a4a52;--ink2:#7a7a85;--accent:#6c63ff;}
*{box-sizing:border-box;}
body{margin:0;background:var(--bg);color:var(--ink);font-family:'Inter',sans-serif;}
.wrap{max-width:1080px;margin:0 auto;padding:24px;}
.neu{background:var(--bg);border-radius:22px;box-shadow:9px 9px 18px var(--sd),-9px -9px 18px var(--sl);}
.neu-sm{background:var(--bg);border-radius:16px;box-shadow:5px 5px 10px var(--sd),-5px -5px 10px var(--sl);}
.btn{display:inline-block;background:var(--accent);color:#fff;padding:14px 30px;border-radius:14px;text-decoration:none;font-weight:600;box-shadow:6px 6px 14px var(--sd);}
.hero{text-align:center;padding:80px 24px;}
h1{font-family:'Outfit',sans-serif;font-size:2.6rem;margin:0 0 16px;}
p.sub{color:var(--ink2);font-size:1.15rem;max-width:640px;margin:0 auto 28px;}
.grid{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));margin:40px 0;}
.card{padding:28px;text-align:left;}
.card h3{font-family:'Outfit',sans-serif;margin:0 0 8px;}
.card p{color:var(--ink2);margin:0;font-size:0.95rem;}
footer{text-align:center;padding:32px;color:var(--ink2);font-size:0.9rem;}
.quote{padding:36px;text-align:center;font-style:italic;font-size:1.1rem;margin:40px 0;}
`;

export function buildStandaloneHtml(businessName, businessType, content) {
  const fontLink = `<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`;

  let bodyHtml = '';

  if (businessType === 'landing-page') {
    bodyHtml = `
      <section class="hero">
        <h1>${content.heroHeading}</h1>
        <p class="sub">${content.heroSubheading}</p>
        <a class="btn" href="#">${content.ctaText}</a>
      </section>
      <div class="wrap">
        <div class="grid">
          ${content.features.map((f) => `<div class="neu card"><h3>${f.title}</h3><p>${f.description}</p></div>`).join('')}
        </div>
        <div class="neu quote">
          "${content.testimonial.quote}"<br/><strong>${content.testimonial.name}</strong>, ${content.testimonial.role}
        </div>
        <section class="hero neu-sm" style="margin-bottom:40px;">
          <h1 style="font-size:1.8rem;">Ready to get started?</h1>
          <a class="btn" href="#">${content.ctaText}</a>
        </section>
      </div>
      <footer>${content.footerText}</footer>
    `;
  } else {
    bodyHtml = `
      <section class="hero">
        <h1>${content.heroHeading}</h1>
        <p class="sub">${content.heroSubheading}</p>
      </section>
      <div class="wrap">
        <div class="neu" style="padding:32px;margin-bottom:40px;">
          <p style="color:var(--ink2);line-height:1.7;">${content.aboutText}</p>
        </div>
        <div class="grid">
          ${content.services.map((s) => `<div class="neu card"><h3>${s.title}</h3><p>${s.description}</p></div>`).join('')}
        </div>
      </div>
      <footer>${content.footerText}</footer>
    `;
  }

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${businessName}</title>
${fontLink}
<style>${NEU_CSS}</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

export function downloadHtmlFile(filename, htmlContent) {
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
