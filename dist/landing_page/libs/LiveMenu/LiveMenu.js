(function($){function liveMenu(element, options) {
		var defaults = {
			button: 'left',
			imagesPath: 'icons/',
			items: [],
			layout: 'circle',
			menuSize: 90,
			opacity: 1,
			position: 'fixed',
			scale: 0.8,
			behind: {
				scale: 0.7,
				opacity: 0.6
			},
			hide: {
				speed: 300,
				delay: 50
			},
			hover: {
				speed: 170,
				opacity: 1
			},
			show: {
				speed: 150,
				delay: 50
			},
			tooltip: {
				arrowColor: '#666',
				color: '#333',
				gradient: '#FFFFFF 0%, #666666 100%',
				delay: 800,
				speed: 200,
				radius: 3
			},
			onShow: function() {},
			onClose: function() {}
		};
		var plugin = this;
		this.$element = $(element);
		this.$menu = $('');
		this.mousePosX = 0;
		this.mousePosY = 0;
		plugin.settings = {};
		plugin.settings = $.extend({}, defaults, options);
		plugin.settings.behind = $.extend({}, defaults.behind, options.behind);
		plugin.settings.hide = $.extend({}, defaults.hide, options.hide);
		plugin.settings.hover = $.extend({}, defaults.hover, options.hover);
		plugin.settings.show = $.extend({}, defaults.show, options.show);
		plugin.settings.tooltip = $.extend({}, defaults.tooltip, options.tooltip);
		plugin.init()
	}; 
	liveMenu.prototype.init = function() {
		var plugin = this;
		var loaded = 0;
		$.each(plugin.settings.items, function(index, item) {
			item.imgFile = new Image();
			item.imgFile.onload = function() {
				loaded++;
				if (loaded == plugin.settings.items.length) {
					plugin.update()
				}
			};
			item.imgFile.src = plugin.settings.imagesPath + item.image
		});
		$('body').click(function() {
			if (!plugin.$menu.is('.hover')) plugin.hideMenu()
		})
	}; 
	liveMenu.prototype.update = function() {
		var plugin = this;
		var $element = this.$element;
		$element.unbind('.liveMenu');
		$(document).bind('mousemove.liveMenu', function(e) {
			plugin.mousePosX = e.pageX;
			plugin.mousePosY = e.pageY
		});
		$element.bind('mousedown.liveMenu', function(e) {
			if ((e.button == 0) && (plugin.settings.button == 'left')) {
				plugin.showMenu()
			} else
			if ((e.button == 1) && (plugin.settings.button == 'left')) {
				plugin.showMenu()
			} else
			if (e.button == 2) {
				plugin.showMenu()
			}
		});
		$element.add($('UL.contextMenu')).bind('contextmenu.liveMenu', function() {
			return false
		})
	}; 
	liveMenu.prototype.showMenu = function() {
		var $img, $tooltip, centerX, centerY;
		var $element = this.$element;
		var _this = this;
		var $menu;
		var $menuOld = this.$menu;
		_this.hideMenu($menuOld);
		var show = function() {
			if (_this.settings.position == 'fixed') {
				centerX = $element.offset().left + $element.width() / 2;
				centerY = $element.offset().top + $element.height() / 2
			} else {
				centerX = _this.mousePosX;
				centerY = _this.mousePosY
			}
			$menu = $('<div class="liveMenu hover"></div>');
			$menu.hover(function() {
				$menu.addClass('hover')
			}, function() {
				$menu.removeClass('hover')
			});
			if (_this.settings.layout == 'rect') {
				$menu.addClass('layoutRect')
			} else
			if (_this.settings.layout == 'circle') {
				$menu.addClass('layoutCircle')
			}
			$.each(_this.settings.items, function(index, item) {
				var link = item.href;
				if ((link == '') || (link == null)) {
					link = 'javascript:'
				}
				if (!item.target) {
					item.target = ''
				}
				var $itemLink = $('<a href="' + link + '" target="' + item.target + '"></a>');
				$img = $(item.imgFile);
				$img.addClass('liveMenuImage');
				$img.prop('alt', item.title);
				$itemLink.append($img);
				$img.css({
					'-moz-transition-duration': _this.settings.hover.speed / 1000 + 's',
					'-webkit-transition-duration': _this.settings.hover.speed / 1000 + 's',
					'-o-transition-duration': _this.settings.hover.speed / 1000 + 's',
					'transition-duration': _this.settings.hover.speed / 1000 + 's',
					'-moz-transform': 'scale(' + _this.settings.scale + ')',
					'-webkit-transform': 'scale(' + _this.settings.scale + ')',
					'-o-transform': 'scale(' + _this.settings.scale + ')',
					'-ms-transform': 'scale(' + _this.settings.scale + ')',
					'transform': 'scale(' + _this.settings.scale + ')',
					opacity: _this.settings.opacity
				});
				var imgHeight = $itemLink.find('.liveMenuImage').height();
				$itemLink.css('lineHeight', imgHeight + 'px');
				$menu.append($itemLink);
				$element.append($menu);
				_this.$menu = $menu;
				$itemLink.delay(index * _this.settings.show.delay).animate({
					opacity: 1
				}, index * _this.settings.show.speed, function() {
					if (index == $menu.find('a').length - 1) {
						_this.settings.onShow()
					}
				});
				var zIndex;
				$itemLink.hover(function() {
					zIndex = $(this).css('zIndex');
					$(this).addClass('hover');
					$(this).css({
						zIndex: '999',
						opacity: _this.settings.hover.opacity
					});
					$(this).find('.liveMenuImage').addClass('active');
					var imgNotSelected = $menu.find('.liveMenuImage').not($(this).find('img'));
					if (_this.settings.behind.scale != _this.settings.scale) {
						imgNotSelected.css({
							'-moz-transform': 'scale(' + _this.settings.behind.scale + ')',
							'-webkit-transform': 'scale(' + _this.settings.behind.scale + ')',
							'-o-transform': 'scale(' + _this.settings.behind.scale + ')',
							'-ms-transform': 'scale(' + _this.settings.behind.scale + ')',
							'transform': 'scale(' + _this.settings.behind.scale + ')'
						})
					}
					imgNotSelected.css('opacity', _this.settings.behind.opacity);
					var showTooltipTimer = function() {
						if ($itemLink.is('.hover')) {
							showTooltip($itemLink)
						}
					};
					setTimeout(showTooltipTimer, _this.settings.tooltip.delay)
				}, function() {
					$(this).css({
						zIndex: zIndex,
						opacity: _this.settings.opacity
					});
					$(this).removeClass('hover');
					$(this).find('.liveMenuImage').removeClass('active');
					var imgNotSelected = $menu.find('.liveMenuImage').not($(this).find('img'));
					if (_this.settings.behind.scale != _this.settings.scale) {
						imgNotSelected.css({
							'-moz-transform': 'scale(' + _this.settings.scale + ')',
							'-webkit-transform': 'scale(' + _this.settings.scale + ')',
							'-o-transform': 'scale(' + _this.settings.scale + ')',
							'-ms-transform': 'scale(' + _this.settings.scale + ')',
							'transform': 'scale(' + _this.settings.scale + ')'
						})
					}
					imgNotSelected.css('opacity', _this.settings.opacity);
					hideTooltip()
				});
				$itemLink.click(function() {
					_this.hideMenu();
					if (item.click) {
						item.click()
					}
				})
			});
			$menu.css({
				left: centerX + 'px',
				top: centerY + 'px',
				width: _this.settings.menuSize + 'px'
			});
			if (_this.settings.layout == 'circle') {
				var posX;
				var posY;
				var margeX = $menu.find('a').eq(0).find('.liveMenuImage').width() / 4;
				var margeY = $menu.find('a').eq(0).find('.liveMenuImage').height() / 4;
				var nb = $menu.find('a').length;
				var rad = 360 / nb;
				var size = _this.settings.menuSize;
				var i = 0;
				for (j = 0; j < 360; j += rad) {
					posX = (size * Math.cos(j * Math.PI / 180)) - margeX;
					posY = (size * Math.sin(j * Math.PI / 180)) - margeY;
					$menu.find('a').eq(i).css('top', (posY - 20 / 2) + "px");
					$menu.find('a').eq(i).css('left', (posX - 20 / 2) + "px");
					i++
				}
			}
		};
		var showTooltip = function($link) {
			if ($tooltip) {
				$tooltip.css('display', 'none')
			}
			var posX = $link.position().left + $link.find('img').width() + 8;
			$tooltip = $('<div class="liveMenuTooltip"><div class="content">' + $link.find('img').prop('alt') + '</div></div>');
			var posY = $link.position().top + $link.find('img').height() / 2;
			$tooltip.css('top', posY);
			$link.after($tooltip);
			var $arrow;
			if (($link.offset().left + $link.width() / 2) < centerX) {
				$arrow = $('<div class="arrowR"></div>');
				$tooltip.prepend($arrow);
				posX = $link.position().left - $tooltip.width() - 8;
				$arrow.css({
					left: $tooltip.width(),
					top: $tooltip.height() / 2 + 'px',
					borderColor: 'transparent transparent transparent ' + _this.settings.tooltip.arrowColor
				})
			} else {
				$arrow = $('<div class="arrowL"></div>');
				$tooltip.prepend($arrow);
				$arrow.css({
					top: $tooltip.height() / 2 + 'px',
					borderColor: 'transparent ' + _this.settings.tooltip.arrowColor + ' transparent transparent'
				})
			}
			var top = $tooltip.height() / 2 + parseInt($tooltip.find('.content').css('paddingTop'));
			$tooltip.css({
				left: posX,
				marginTop: -top + 'px',
				color: _this.settings.tooltip.color
			});
			applyTooltipGradient();
			$tooltip.fadeIn(_this.settings.tooltip.speed)
		};
		var hideTooltip = function() {
			if ($tooltip) {
				var oldTooltip = $tooltip;
				oldTooltip.fadeOut(_this.settings.tooltip.speed)
			}
		};
		var applyTooltipGradient = function() {
			$tooltipContent = $tooltip.find('.content');
			var gradientPoints = getGradientFromString(_this.settings.tooltip.gradient);
			var svg = '<svg xmlns="http://www.w3.org/2000/svg">' + '<defs>' + '<linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">';
			var webkitCss = '-webkit-gradient(linear, left top, left bottom';
			var defCss = '';
			$.each(gradientPoints, function(i, el) {
				webkitCss += ', color-stop(' + el[0] + ', ' + el[1] + ')';
				defCss += ',' + el[1] + ' ' + el[0] + '';
				svg += '<stop offset="' + el[0] + '" style="stop-color:' + el[1] + ';" />'
			});
			webkitCss += ')';
			defCss = defCss.substr(1);
			svg += '</linearGradient>' + '</defs>';
			svg += '<rect fill="url(#gradient)" height="100%" width="100%" rx="' + _this.settings.tooltip.radius + '" ry="' + _this.settings.tooltip.radius + '" />';
			svg += '</svg>';
			svg = encode64(svg);
			$tooltipContent.css('background', 'url(data:image/svg+xml;base64,' + svg + ')');
			$tooltipContent.css('border-radius', _this.settings.tooltip.radius + 'px');
			if ((getIEVersion() < 9) && (getIEVersion() > 0)) {
				$tooltipContent.css('filter', 'progid:DXImageTransform.Microsoft.gradient( startColorstr="' + gradientPoints[0][1] + '", endColorstr="' + gradientPoints[gradientPoints.length - 1][1] + '",GradientType=0 )');
				$tooltipContent.css('backgroundColor', gradientPoints[0][1])
			}
		};
		var encode64 = function(input) {
			var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64
				} else
				if (isNaN(chr3)) {
					enc4 = 64
				}
				output += keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4)
			}
			return output
		};
		var getIEVersion = function() {
			var rv = -1;
			if (navigator.appName == 'Microsoft Internet Explorer') {
				var ua = navigator.userAgent;
				var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
				if (re.exec(ua) != null) rv = parseFloat(RegExp.$1)
			}
			return rv
		};
		var getGradientFromString = function(gradient) {
			var gradientArray = new Array();
			var gradientPointsTmp = gradient.split(',');
			$.each(gradientPointsTmp, function(i, el) {
				var position;
				if ((el.substr(el.indexOf('%') - 3, el.indexOf('%')) == '100') || (el.substr(el.indexOf('%') - 3, el.indexOf('%')) == '100%')) {
					position = '100%'
				} else
				if (el.indexOf('%') > 1) {
					position = parseInt(el.substr(el.indexOf('%') - 2, el.indexOf('%')));
					position += '%'
				} else {
					position = parseInt(el.substr(el.indexOf('%') - 1, el.indexOf('%')));
					position += '%'
				}
				var color = el.substr(el.indexOf('#'), 7);
				gradientArray.push([position, color])
			});
			return gradientArray
		};
		show()
	}; 
	liveMenu.prototype.hideMenu = function() {
		var _this = this;
		var $menuObject = _this.$menu;
		$menuObject.find('a').each(function(i, link) {
			$menuObject.find('a').eq(i).stop();
			if (i == $menuObject.find('a').length - 1) {
				$menuObject.find('a').eq(i).delay(i * _this.settings.hide.delay).animate({
					opacity: 0
				}, _this.settings.hide.speed, function() {
					$menuObject.remove();
					_this.settings.onClose()
				})
			} else {
				$menuObject.find('a').eq(i).delay(i * _this.settings.hide.delay).animate({
					opacity: 0
				}, _this.settings.hide.speed)
			}
		})
	}; 
	$.fn.liveMenu = function(options) {
		return this.each(function() {
			if (undefined == $(this).data('liveMenu')) {
				var plugin = new liveMenu(this, options);
				$(this).data('liveMenu', plugin)
			}
		})
	}
})(jQuery);