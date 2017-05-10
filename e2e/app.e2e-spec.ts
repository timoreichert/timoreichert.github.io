import { Timoreichert.Github.IoPage } from './app.po';

describe('timoreichert.github.io App', () => {
  let page: Timoreichert.Github.IoPage;

  beforeEach(() => {
    page = new Timoreichert.Github.IoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
