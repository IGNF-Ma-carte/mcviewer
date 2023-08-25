$(document).ready(function() {
  $('#toc-search').on('keyup change search', function() {
    var rex = new RegExp(this.value, 'i');
    $('#toc a').each(function() {
      if (/#toc/.test(this.href) || rex.test(this.innerText)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    })
  });
  setTimeout(function() {
    $('#toc a').each(function() {
      if (/^api$|^MapIFrameAPI$|^$/.test(this.innerText)) {
        $(this).addClass('hidden');
      }
      if (/^api|^MapIFrame|^Global/.test(this.innerText)) {
        $(this).addClass('header0');
      }
      if (/^Methods|^Events|^Members|^Type Def/.test(this.innerText)) {
        $(this).addClass('header');
      }
    })
  });
});