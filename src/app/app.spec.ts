import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('App', () => {
  // Helper: sets up a fresh TestBed + returns fixture and httpMock
  async function setup() {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    const httpMock = TestBed.inject(HttpTestingController);
    return { fixture, httpMock };
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create the component', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have the default title signal value', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance['title']()).toBe('frontend-angular');
  });

  it('should make GET requests to all three API endpoints on init', async () => {
    const { fixture, httpMock } = await setup();
    fixture.detectChanges(); // triggers ngOnInit

    const apiTestReq = httpMock.expectOne('http://localhost:3000/api/test');
    expect(apiTestReq.request.method).toBe('GET');

    const dbTestReq = httpMock.expectOne('http://localhost:3000/api/db-test');
    expect(dbTestReq.request.method).toBe('GET');

    const usersReq = httpMock.expectOne('http://localhost:3000/api/users');
    expect(usersReq.request.method).toBe('GET');

    apiTestReq.flush({ message: 'ok' });
    dbTestReq.flush({ connected: true });
    usersReq.flush([{ id: 1, name: 'Alice' }]);

    httpMock.verify();
  });

  it('should log response from /api/test on success', async () => {
    const { fixture, httpMock } = await setup();
    const consoleSpy = vi.spyOn(console, 'log');

    fixture.detectChanges();

    const mockResponse = { message: 'test success' };
    httpMock.expectOne('http://localhost:3000/api/test').flush(mockResponse);
    httpMock.expectOne('http://localhost:3000/api/db-test').flush({});
    httpMock.expectOne('http://localhost:3000/api/users').flush([]);

    expect(consoleSpy).toHaveBeenCalledWith('Response from backend:', mockResponse);
    httpMock.verify();
  });

  it('should log an error when /api/users request fails', async () => {
    const { fixture, httpMock } = await setup();
    const consoleErrorSpy = vi.spyOn(console, 'error');

    fixture.detectChanges();

    httpMock.expectOne('http://localhost:3000/api/test').flush({});
    httpMock.expectOne('http://localhost:3000/api/db-test').flush({});
    httpMock
      .expectOne('http://localhost:3000/api/users')
      .flush('Not Found', { status: 404, statusText: 'Not Found' });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching data from backend:',
      expect.anything(),
    );
    httpMock.verify();
  });
});
