DocsApp.controller('ColorPaletteCtrl', [
  '$rootScope',
  '$scope',
  '$mdColorPalette',
  function ($rootScope, $scope, $mdColorPalette) {
    var orderedColors = [
      'red',
      'pink',
      'purple',
      'deep-purple',
      'indigo',
      'blue',
      'teal',
      'green',
      'light-green',
      'lime',
      'yellow',
      'orange',
      'grey'
    ];

    var shades = [
      '50',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900'
    ];

    var accents = [
      'A100',
      'A200',
      'A400',
      'A700'
    ];

    $scope.colors = orderedColors.map(function(colorName) {
      var color = $mdColorPalette[colorName];

      return {
        name: colorName,
        primary: presentedColor('500', color['500']),
        shades: shades.map(function(shade){
          return presentedColor(shade, color[shade]);
        }),
        accents: accents.map(function(accent) {
          return presentedColor(accent, color[accent]);
        })
      };
    });

    function presentedColor(shade, color) {
      return {
        hue: shade,
        rgb: color.value.join(','),
        hex: rgbToHex(color.value),
        contrast: color.contrast ? color.contrast.join(',') : ''
      };
    };

    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(rgb) {
      return ("#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2])).toUpperCase();
    }
  }
]);

DocsApp.directive('demoColorPalette', ['$compile', function($compile) {
  return {
    restrict: 'E',
    scope: true,
    link: postLink
  };

  function postLink(scope, element, attr) {
    var count = 0;
    var container;
    angular.forEach(scope.colors, function(color) {
      if (count % attr.colorsPerRow == 0) {
        container = angular.element($compile("<div class='color-palette' layout='row' layout-sm='column'></div>")(scope));
        element.append(container);
      }

      scope.color = color;
      var percentPerColumn = 100/attr.colorsPerRow;
      var swatch = angular.element($compile("<demo-color-swatch flex='" + percentPerColumn + "' flex-sm='100'></demo-color-swatch>")(scope));
      container.append(swatch);
      count++;
    });
  };
}]);

DocsApp.directive('demoColorSwatch', function() {
    return {
      restrict: 'E',
      scope: true,
      link: postLink
    };

    function postLink(scope, element, attr) {
      var color = scope.color;
      var primary = color.primary;

      var container = angular.element("<ul class='color-swatch'></ul>");
      var header = createRow(primary, 'main-color');

      header.append("<span class='color-name'>" + color.name + "</span>");
      header.append(hue(primary.hue));
      header.append(hex(primary.hex));

      container.append(header);

      angular.forEach(color.shades, function(shade) {
        var row = createRow(shade);
        row.append(hue(shade.hue));
        row.append(hex(shade.hex));
        container.append(row);
      });

      angular.forEach(color.accents, function(accent) {
        var row = createRow(accent, 'accent');
        row.append(hue(accent.hue));
        row.append(hex(accent.hex));
        container.append(row);
      });

      element.append(container);
    };

    function createRow(color, classes) {
      return angular.element("<li class='" + classes + "' style='color: rgba(" + color.contrast + "); background-color: rgb(" + color.rgb + ");'></li>");
    };

    function hue(shade) {
      return "<span class='shade'>" + shade + "</span>";
    }

    function hex(rgb) {
      return "<span class='hex'>" + rgb + "</span>";
    }
  }
);
