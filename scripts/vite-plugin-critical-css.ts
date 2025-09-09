import { type Plugin } from 'vite';

/**
 * 关键 CSS 内联插件
 * 将关键样式内联到 HTML 中，避免白屏问题
 */
export function criticalCSSPlugin(): Plugin {
  return {
    name: 'vite-plugin-critical-css',
    apply: 'build',
    enforce: 'post', // 确保在其他插件之后执行
    generateBundle(opts, bundle) {
      const htmlFiles = Object.keys(bundle).filter(name => name.endsWith('.html'));

      htmlFiles.forEach(htmlFile => {
        const htmlChunk = bundle[htmlFile];
        if (htmlChunk.type !== 'asset') return;

        let htmlContent = htmlChunk.source as string;

        // 定义关键样式 - 压缩版本，修复字体加载抖动
        const criticalStyles = `:root{--font-color:#15264b;--font-title-color:#1c3264;--body-color:#f9f9f9;--bodybg-color:#f6f6f6;--font-secondary-color:#22242c;--font-light-color:#a0a0b0;--primary:140,118,240;--secondary:100,100,100;--success:20,120,52;--danger:240,10,200;--warning:215,220,65;--info:46,94,231;--light:215,208,200;--dark:40,38,50;--white:255,255,255;--black:0,0,0;--border_color:#e0dfd6;--bs-danger:#f00ac8;--box-shadow:0 0 21px 3px rgba(var(--secondary),.05);--app-transition:all .3s ease;--light-gray:#f4f7f8;--font-size:14px;--p-font-size:14px;--h1-font-size:2.5rem;--h2-font-size:2rem;--h3-font-size:1.75rem;--h4-font-size:1.25rem;--h5-font-size:1.125rem;--h6-font-size:1rem;--btn-font-size:15px;--app-border-radius:1.8rem;--bs-border-radius:1.8rem}body{font-size:var(--font-size);font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:var(--font-color);background-color:var(--bodybg-color);margin:0;padding:0;line-height:1.6;font-display:swap}html{font-display:swap}h1,h2,h3,h4,h5,h6{line-height:1.4;color:var(--font-color);margin:0 0 .5rem 0;font-family:inherit}h1{font-size:var(--h1-font-size);font-weight:800}h2{font-size:var(--h2-font-size);font-weight:700}h3{font-size:var(--h3-font-size);font-weight:600}h4{font-size:var(--h4-font-size);font-weight:600}h5{font-size:var(--h5-font-size);font-weight:600}h6{font-size:var(--h6-font-size);font-weight:600}p{font-size:var(--p-font-size);line-height:1.6;margin-bottom:5px;font-weight:500;font-family:inherit}a{color:rgba(var(--dark),1);text-decoration:none;font-family:inherit}a:hover{text-decoration:none}.btn{padding:7px 25px;font-size:var(--btn-font-size);border-radius:5px;border:none;cursor:pointer;display:inline-block;text-align:center;transition:var(--app-transition);font-family:inherit}.btn:hover{transform:translateY(-1px);transition:all .3s ease}.d-flex{display:flex}.d-flex-center{display:flex;align-items:center;justify-content:center}.justify-content-center{justify-content:center}.align-items-center{align-items:center}.mg-b-0{margin-bottom:0!important}.mg-b-5{margin-bottom:5px!important}.mg-b-10{margin-bottom:10px!important}.mg-b-15{margin-bottom:15px!important}.mg-b-20{margin-bottom:20px!important}.pa-10{padding:10px!important}.pa-15{padding:15px!important}.pa-20{padding:20px!important}.text-primary{color:rgba(var(--primary),1)!important}.text-secondary{color:rgba(var(--secondary),1)!important}.text-success{color:rgba(var(--success),1)!important}.text-danger{color:rgba(var(--danger),1)!important}.text-muted{color:var(--font-light-color)!important}.bg-primary{background-color:rgba(var(--primary),1)!important;color:rgba(var(--white),1)}.bg-light{background-color:rgba(var(--light),1)!important}.card{background-color:rgba(var(--white),1);border:1px solid var(--border_color);border-radius:var(--bs-border-radius);box-shadow:var(--box-shadow);margin-bottom:1rem}.w-100{width:100%!important}.h-100{height:100%!important}.loading-skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}@media (prefers-color-scheme:dark){:root{--white:32,35,53;--black:#dce2f0;--bodybg-color:#272b3e;--font-color:#fff;--box-shadow:0 .2rem 1rem #333644;--light-gray:#333644;--light:71,71,96;--dark:234,234,236;--border_color:#474a56}.card{background-color:rgba(var(--white),1);border-color:var(--border_color)}}*{box-sizing:border-box}.fade-in{opacity:0;animation:fadeIn .3s ease-in-out forwards}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}.wf-loading *{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif!important}`;

        // 在 head 标签内插入关键样式
        const criticalStyleTag = `
  <style id="critical-css">
${criticalStyles}
  </style>`;

        // 在 </head> 前插入关键样式
        htmlContent = htmlContent.replace(
          '</head>',
          `${criticalStyleTag}
  </head>`,
        );

        // 添加字体加载优化脚本
        const fontOptimizationScript = `<script>(function(){var a=function(){return!!(document.fonts&&document.fonts.check&&document.fonts.check('1em Montserrat'))},b=function(){document.documentElement.classList.add('fonts-loaded');document.body.style.fontFamily='Montserrat, system-ui, -apple-system, sans-serif'};a()?b():(document.fonts&&document.fonts.ready&&document.fonts.ready.then(function(){a()&&b()}),setTimeout(b,3000));window.addEventListener('load',function(){var c=document.getElementById('critical-css');c&&document.styleSheets.length>1&&setTimeout(function(){c.remove()},1000)})})();</script>`;

        // 在 </body> 前插入字体优化脚本
        htmlContent = htmlContent.replace(
          '</body>',
          `${fontOptimizationScript}
</body>`,
        );

        htmlChunk.source = htmlContent;
      });
    },
  };
}
