(function(){
  const config=window.SITE_CONFIG||{};
  const booking=config.NEXT_PUBLIC_BOOKING_URL||"/contact/";
  const current=location.pathname;
  const header=document.querySelector("[data-site-header]");
  if(header) header.innerHTML=`<header class="site-header"><a class="brand" href="/" aria-label="Abhinav Shrestha, home"><img class="brand-logo brand-logo-header" src="/assets/abhinav-shrestha-logo.png" width="936" height="283" alt="Abhinav Shrestha"></a><nav class="desktop-nav" aria-label="Primary navigation"><a ${current==='/'?'aria-current="page"':''} href="/">Home</a><a ${current.startsWith('/about')?'aria-current="page"':''} href="/about/">About</a><a ${current.startsWith('/services')?'aria-current="page"':''} href="/services/">Services</a><a ${current.startsWith('/blog')?'aria-current="page"':''} href="/blog/">Insights</a><a ${current.startsWith('/contact')?'aria-current="page"':''} href="/contact/">Contact</a></nav><a class="button button-small booking-link" href="${booking}">Book a Free Consultation Call</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span></span><span></span></button></header><div class="mobile-menu" id="mobile-menu" hidden><a href="/">Home</a><a href="/about/">About Me</a><a href="/services/">Services</a><a href="/blog/">Insights</a><a href="/contact/">Contact</a><a class="button booking-link" href="${booking}">Book a Free Consultation Call</a></div>`;
  document.querySelectorAll('.booking-link').forEach(a=>{a.href=booking;if(booking!=="/contact/"){a.target="_blank";a.rel="noopener"}});
  const toggle=document.querySelector('.menu-toggle'), menu=document.querySelector('.mobile-menu');
  toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));toggle.setAttribute('aria-label',open?'Open menu':'Close menu');menu.hidden=open;document.body.classList.toggle('menu-open',!open)});
  const footer=document.querySelector("[data-site-footer]");
  if(footer) footer.innerHTML=`<footer class="footer"><div class="shell footer-grid"><div><a class="brand brand-light brand-footer" href="/" aria-label="Abhinav Shrestha, home"><img class="brand-logo brand-logo-footer" src="/assets/abhinav-shrestha-logo.png" width="936" height="283" alt="Abhinav Shrestha"></a><p>I help small and medium-sized businesses understand what's holding their marketing back, find new growth opportunities, and build practical AI-powered digital marketing systems designed to attract more customers and generate more sales.</p></div><div><h3>Explore</h3><a href="/about/">About</a><a href="/services/">Services</a><a href="/blog/">Insights</a><a href="/contact/">Contact</a></div><div><h3>Services</h3><a href="/services/#meta-ads">Meta Ads</a><a href="/services/#digital-marketing">Digital Marketing Strategy</a><a href="/services/#email-marketing">Email Marketing</a><a href="/services/#ai-marketing">AI-Powered Marketing</a></div><div><h3>Start a conversation</h3><p>Get a customized digital marketing plan based on your business goals.</p><a class="button button-light booking-link" href="${booking}">Book a Free Consultation Call</a></div></div><div class="shell footer-bottom"><span>© ${new Date().getFullYear()} Abhinav Shrestha</span><span><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></span></div></footer>`;
  const favicon=document.querySelector('link[rel="icon"]')||document.head.appendChild(Object.assign(document.createElement('link'),{rel:'icon'}));
  favicon.type='image/png';favicon.href='/assets/abhinav-shrestha-logo.png';
  document.querySelectorAll('[data-accordion]').forEach(item=>{const b=item.querySelector('button');b?.addEventListener('click',()=>{const open=item.hasAttribute('open');document.querySelectorAll('[data-accordion][open]').forEach(x=>x.removeAttribute('open'));if(!open)item.setAttribute('open','')})});
  const form=document.querySelector('#contact-form');
  if(form){
    const status=document.querySelector('#form-status'),submit=form.querySelector('button[type=submit]');
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      if(!form.reportValidity())return;
      submit.disabled=true;
      submit.textContent='Sending your request…';
      status.className='form-status is-loading';
      status.textContent='Sending your consultation request securely…';
      if(!config.FORM_ENDPOINT){status.className='form-status is-error';status.innerHTML='<strong>That didn’t send.</strong> Please email abhinawstha@gmail.com instead.';submit.disabled=false;submit.textContent='Request My Free Consultation';return}
      try{
        const body=Object.fromEntries(new FormData(form).entries());
        const res=await fetch(config.FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)});
        const data=await res.json().catch(()=>({}));
        if(!res.ok||data.success===false||data.success==='false')throw new Error(data.message||'Unable to submit');
        form.reset();
        status.className='form-status is-success';
        status.innerHTML='<strong>Thank you.</strong> Your consultation request has been sent to Abhinav. I’ll be in touch soon.';
      }catch{
        status.className='form-status is-error';
        status.innerHTML='<strong>That didn’t send.</strong> Please try again, or email <a href="mailto:abhinawstha@gmail.com">abhinawstha@gmail.com</a>.';
      }finally{
        submit.disabled=false;
        submit.textContent='Request My Free Consultation';
      }
    })
  }
  document.querySelectorAll('.section-head').forEach(el=>el.classList.add('reveal','motion-left'));
  document.querySelectorAll('.pain-grid>.reveal:nth-child(2),.ai-split>.reveal:nth-child(2),.about-split>.reveal:nth-child(2)').forEach(el=>el.classList.add('motion-right'));
  document.querySelectorAll('.process-step,.ai-row').forEach((el,index)=>{el.classList.add('reveal','motion-scale');el.style.setProperty('--reveal-delay',`${(index%4)*75}ms`)});
  document.querySelectorAll('.cta-band').forEach(el=>el.classList.add('reveal','motion-scale'));
  const observer=new IntersectionObserver(items=>items.forEach(i=>{if(i.isIntersecting){i.target.classList.add('in');observer.unobserve(i.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.appendChild(progress);
  let progressTick=false;const updateProgress=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.setProperty('--scroll-progress',String(max>0?Math.min(1,scrollY/max):0));progressTick=false};addEventListener('scroll',()=>{if(!progressTick){progressTick=true;requestAnimationFrame(updateProgress)}},{passive:true});addEventListener('resize',updateProgress);updateProgress();
})();
