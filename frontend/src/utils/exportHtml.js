const NEU_CSS = `
:root{--bg:#e4e9f0;--sl:#ffffff;--sd:#b7bcc7;--ink:#4a4a52;--ink2:#7a7a85;--accent:#6c63ff;}
*{box-sizing:border-box;}
body{margin:0;background:var(--bg);color:var(--ink);font-family:'Inter',sans-serif;overflow-x:hidden;}
.wrap{max-width:1080px;margin:0 auto;padding:24px;position:relative;z-index:1;}
.neu{background:var(--bg);border-radius:22px;box-shadow:9px 9px 18px var(--sd),-9px -9px 18px var(--sl);transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s cubic-bezier(.22,1,.36,1);}
.neu:hover{transform:translateY(-6px);box-shadow:14px 14px 28px var(--sd),-14px -14px 28px var(--sl);}
.neu-sm{background:var(--bg);border-radius:16px;box-shadow:5px 5px 10px var(--sd),-5px -5px 10px var(--sl);}
.btn{display:inline-block;background:var(--accent);color:#fff;padding:14px 32px;border-radius:14px;text-decoration:none;font-weight:600;box-shadow:6px 6px 14px var(--sd);transition:transform .2s ease;}
.btn:hover{transform:translateY(-2px);}
.hero{text-align:center;padding:96px 24px;position:relative;z-index:1;}
h1{font-family:'Outfit',sans-serif;font-size:2.75rem;margin:0 0 16px;line-height:1.15;}
.gradient-text{background:linear-gradient(120deg,#6c63ff 0%,#a78bfa 55%,#6c63ff 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}
p.sub{color:var(--ink2);font-size:1.15rem;max-width:640px;margin:0 auto 32px;}
.grid{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));margin:48px 0;}
.card{padding:30px;text-align:left;}
.card h3{font-family:'Outfit',sans-serif;margin:0 0 8px;}
.card p{color:var(--ink2);margin:0;font-size:0.95rem;}
footer{text-align:center;padding:36px;color:var(--ink2);font-size:0.9rem;position:relative;z-index:1;}
.quote{padding:40px;text-align:center;font-style:italic;font-size:1.15rem;margin:48px 0;}
.blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.35;pointer-events:none;z-index:0;}
.blob1{width:320px;height:320px;background:var(--accent);top:-40px;left:-60px;animation:floatSlow 7s ease-in-out infinite;}
.blob2{width:380px;height:380px;background:#a78bfa;top:160px;right:-100px;animation:floatSlower 9s ease-in-out infinite;}
@keyframes floatSlow{0%,100%{transform:translate(0,0)}50%{transform:translate(10px,-18px)}}
@keyframes floatSlower{0%,100%{transform:translate(0,0)}50%{transform:translate(-12px,14px)}}
.reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease;}
.reveal.in{opacity:1;transform:translateY(0);}
@media (prefers-reduced-motion: reduce){.reveal{opacity:1;transform:none;transition:none;}.blob1,.blob2{animation:none;}}
`;

const REVEAL_SCRIPT = `
document.addEventListener('DOMContentLoaded', function () {
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach(function(el){ el.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 90 + 'ms';
    io.observe(el);
  });
});
`;

export function buildStandaloneHtml(businessName, businessType, content) {
  const fontLink = `<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`;
  const blobs = `<div class="blob blob1"></div><div class="blob blob2"></div>`;

  let bodyHtml = '';

  if (businessType === 'landing-page') {
    bodyHtml = `
      ${blobs}
      <section class="hero">
        <h1 class="reveal gradient-text">${content.heroHeading}</h1>
        <p class="sub reveal">${content.heroSubheading}</p>
        <a class="btn reveal" href="#">${content.ctaText}</a>
      </section>
      <div class="wrap">
        <div class="grid">
          ${content.features.map((f) => `<div class="neu card reveal"><h3>${f.title}</h3><p>${f.description}</p></div>`).join('')}
        </div>
        <div class="neu quote reveal">
          "${content.testimonial.quote}"<br/><strong>${content.testimonial.name}</strong>, ${content.testimonial.role}
        </div>
        <section class="hero neu-sm reveal" style="margin-bottom:48px;">
          <h1 style="font-size:1.9rem;">Ready to get started?</h1>
          <a class="btn" href="#">${content.ctaText}</a>
        </section>
      </div>
      <footer>${content.footerText}</footer>
    `;
  } else {
    bodyHtml = `
      ${blobs}
      <section class="hero">
        <h1 class="reveal">${content.heroHeading}</h1>
        <p class="sub reveal">${content.heroSubheading}</p>
      </section>
      <div class="wrap">
        <div class="neu reveal" style="padding:34px;margin-bottom:48px;">
          <p style="color:var(--ink2);line-height:1.7;">${content.aboutText}</p>
        </div>
        <div class="grid">
          ${content.services.map((s) => `<div class="neu card reveal"><h3>${s.title}</h3><p>${s.description}</p></div>`).join('')}
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
<script>${REVEAL_SCRIPT}</script>
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
