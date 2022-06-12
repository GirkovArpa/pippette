import { $, $$ } from '@sciter';
import { launch } from '@env';

$('#sciter').on('click', () => {
  launch('https://sciter.com/?ref=pippette');
});

$('#terra-informatica').on('click', () => {
  launch('https://terrainformatica.com/?ref=pippette');
});

$('#girkov-arpa').on('click', () => {
  launch('https://girkovarpa.itch.io/?ref=pippette');
});

$('button').on('click', () => Window.this.close());
