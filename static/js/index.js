document.addEventListener('DOMContentLoaded', function () {

  // ---- Results carousel (same library and options as the Nerfies page) ----
  if (window.bulmaCarousel) {
    // Open on the middle clip so the strip reads as a loop, not as a start.
    var slideCount = document.querySelectorAll('.results-carousel .item').length;
    bulmaCarousel.attach('.carousel', {
      slidesToScroll: 1,
      slidesToShow: 5,
      initialSlide: Math.floor(slideCount / 2),
      loop: true,
      infinite: true,
      autoplay: false,
      breakpoints: [
        { changePoint: 640,  slidesToShow: 2, slidesToScroll: 1 },
        { changePoint: 1023, slidesToShow: 3, slidesToScroll: 1 },
        { changePoint: 1215, slidesToShow: 4, slidesToScroll: 1 }
      ]
    });
  }

  // ---- Load and play only the clips actually on screen ----
  // The carousel clones slides when looping, so watch the elements themselves
  // rather than tracking indices.
  var videos = Array.prototype.slice.call(document.querySelectorAll('.results-carousel video'), 0);

  function play(video) {
    if (video.preload === 'none') {
      video.preload = 'auto';
      video.load();
    }
    var started = video.play();
    if (started && started.catch) started.catch(function () {});
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          play(entry.target);
        } else {
          entry.target.pause();
        }
      });
    }, { threshold: 0.35 });

    videos.forEach(function (v) { observer.observe(v); });

    // Clones are created by the carousel after it attaches, so pick them up too.
    setTimeout(function () {
      Array.prototype.slice.call(document.querySelectorAll('.results-carousel video'), 0)
        .forEach(function (v) {
          if (videos.indexOf(v) === -1) { videos.push(v); observer.observe(v); }
        });
    }, 300);
  } else {
    videos.forEach(play);
  }
});
