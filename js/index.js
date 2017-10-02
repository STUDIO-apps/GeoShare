$('.toggle').on('click', function() {
  $('.container').stop().addClass('active');
});

$('.close').on('click', function() {
  $('.container').stop().removeClass('active');
});

if (document.getElementById('pac-input').value !== '') {
		document.getElementsById('searchbutton').style.cursor = "pointer";
		}
	