$(document).ready(function(){

  // Header slider
  const headerSlider = $("#headerSlider");

  headerSlider.on('initialized.owl.carousel', function(event) {
    $('.slide-controls-number__active').text(event.item.index + 1);
    $('.slide-controls-number__total').text(event.item.count);
  });

  headerSlider.owlCarousel({
    items: 1,
    dots: false,
    smartSpeed: 2000
  });

  $('#headerSliderLeft').click(function(event) {
    event.preventDefault();
    headerSlider.trigger('prev.owl.carousel');
  });

  $('#headerSliderRight').click(function(event) {
    event.preventDefault();
    headerSlider.trigger('next.owl.carousel');
  });

  headerSlider.on('changed.owl.carousel', function(event) {
    $('.slide-controls-number__active').text(event.item.index + 1);
    $('.slide-controls-number__total').text(event.item.count);
  });

  // Shop slider
  const shopSlider = $('#shopSlider');

  shopSlider.owlCarousel({
    loop: true,
    dots: false,
    margin: 2,
    smartSpeed: 500,
    responsive: {
      // breakpoint from 0 up
      0: {
        items: 1,
      },
      // breakpoint from 1200 up
      1254: {
        items: 3,
      }
    }
  });

  $('#shopSliderLeft').click(function(event) {
    event.preventDefault();
    shopSlider.trigger('prev.owl.carousel');
  });

  $('#shopSliderRight').click(function(event) {
    event.preventDefault();
    shopSlider.trigger('next.owl.carousel');
  });
  
});