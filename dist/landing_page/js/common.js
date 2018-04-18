$(document).ready(function() {

    $(".section_header").animated("fadeInUp", "fadeOutDown");

    $(".animation_1").animated("flipInY", "fadeOutDown");
    $(".animation_2").animated("fadeInLeft", "fadeOutDown");
    $(".animation_3").animated("fadeInRight", "fadeOutDown");

    $("div.menu_item_i").removeClass("menu_item_i").addClass("menu_item");

    function heightDetect() {
		$(".main_head").css("height", $(window).height());
	};
	heightDetect();
	$(window).resize(function() {
		heightDetect();
	});

    $(".section_header").animated("fadeInUp", "fadeOutDown");

	$("div.menu_item_i").removeClass("menu_item_i").addClass("menu_item");
});

$(window).load(function() {
	$(".loaderInner").fadeOut();
	$(".loader").delay(400).fadeOut("slow");
});
