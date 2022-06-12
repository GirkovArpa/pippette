import { $, $$ } from '@sciter';
import movableView from 'this://app/js/movableview.js';

let PIXEL_COLOR = null;

main();

$('#info').on('click', () =>
  Window.this.modal({ url: 'this://app/html/about.html' })
);

function main() {
  adjustWindow();
  monitorMouse();
  movableView('#header');
  $('#minimize').on(
    'click',
    () => (Window.this.state = Window.WINDOW_MINIMIZED)
  );
  $('#close').on('click', () => Window.this.close());

  document.on('change', 'input|hslider', (evt, el) => {
    const hsliders = $$('input|hslider');
    const textboxes = $$('input|text');
    hsliders.forEach(({ value }, i) => {
      textboxes[i].value = value;
    });
    const [r, g, b, a] = hsliders.map(({ value }) => Number(value));
    const color = `rgba(${r}, ${g}, ${b}, ${a})`;
    $('#contents').style.variable('color', color);

    const hex = RGBAtoHex({ r, g, b, a });

    $('#hex > input').value = hex.toUpperCase();
  });
}

function RGBAtoHex({ r, g, b, a }) {
  const [red, green, blue] = [r, g, b].map((n) =>
    Math.round(n).toString(16).padStart(2, '0')
  );

  const alpha = Math.round(a * 255)
    .toString(16)
    .padStart(2, '0');

  return `#${red}${green}${blue}${alpha}`;
}

function adjustWindow() {
  const [wmin, w] = document.state.contentWidths();
  const h = document.state.contentHeight(w);
  const [sw, sh] = Window.this.screenBox('frame', 'dimension');
  Window.this.move((sw - w) / 2, (sh - h) / 2, w, h, true);
}

function colorToRGB(color) {
  let b = (color >> 16) & 0xff;
  let g = (color >> 8) & 0xff;
  let r = color & 0xff;
  return { r, g, b };
}

function monitorMouse() {
  setInterval(async () => {
    const color = await getPixelColor();
    PIXEL_COLOR = color;
  }, 50);
}

function getPixelColor() {
  return new Promise((resolve) => {
    Window.this.xcall('get_pixel_color', resolve);
  });
}

let CROSSHAIR = null;
Graphics.Image.load('this://app/png/crosshair.png').then(
  (image) => (CROSSHAIR = image)
);

function drawHalo(c) {
  const image = new Graphics.Image(100, 100, function (gfx) {
    const { r, g, b } = colorToRGB(c);
    const color = `rgb(${r}, ${g}, ${b})`;
    const circle = new Graphics.Path();
    circle.arc(0, 0, 45, 0, 2 * Math.PI);
    circle.close();
    gfx.strokeStyle = color;
    gfx.strokeWidth = 10;
    gfx.draw(circle, { x: 50, y: 50, stroke: true });
    gfx.draw(CROSSHAIR, { x: 38, y: 38 });
  });

  document.style.setCursor(image, 50, 50);
}

function updateColor(color) {
  const { r, g, b } = colorToRGB(color);
  [r, g, b].forEach((component, i) => {
    $$('input|hslider')[i].value = component;
    $$('input|text')[i].value = component;
  });
  $('#hex > input').value =
    '#' +
    [r, g, b, $('#alpha').value]
      .map((v, i) => {
        if (i < 3) {
          return Math.round(v).toString(16).padStart(2, '0');
        } else {
          return Math.round(v * 255)
            .toString(16)
            .padStart(2, '0');
        }
      })
      .join('');
  $('#contents').style.variable('color', $('#hex > input').value);
  drawHalo(color);
}

function doDrag(element, evt, callback) {
  async function onmove(evt) {
    console.log(evt.screenX + ', ' + evt.screenY);
    updateColor(PIXEL_COLOR);
  }

  document.post(() => {
    document.classList.add('dragging');
    //document.style.cursor = 'crosshair !important';
    document.state.capture(true);
    document.on('mousemove', onmove);
    Window.this.doEvent('untilMouseUp');
    document.style.cursor = 'default';
    document.state.capture(false);
    document.off(onmove);
    document.classList.remove('dragging');
  });
}

document.$('#dropper').on('mousedragrequest', function (evt) {
  doDrag(this, evt);
  return true;
});
/*
import * as sys from '@sys';
const HOME = sys.cwd();
setTimeout(() => {
  screenshot();
}, 2000);

function screenshot() {
  setTimeout(async () => {
    const image = new Graphics.Image(440, 180, document);
    console.log(image);
    const bytes = image.toBytes('png');
    console.log(bytes);
    const path = HOME + '/test.png';
    try {
      const file = await sys.fs.open(path, 'w+', 0o666);
      await file.write(bytes);
    } catch (e) {
      Window.this.modal(
        <warning>
          Cannot open file {path} for writing.
          <br />
          {e}
          <br />
          Settings will not be saved.
        </warning>
      );
    }
  }, 3000);
}
*/