import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentService } from './document.service';
import { environment } from '../../../../environments/environment';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiBase}/documents`;
  const reqUrl = `${environment.apiBase}/policy-document-requirements`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentService],
    });
    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRequirements', () => {
    it('should GET document requirements for a policy and stage', () => {
      const mockReqs = [{ id: 1, policyId: 1, documentType: 'ID_PROOF', stage: 'APPLICATION' }];
      service.getRequirements(1, 'APPLICATION').subscribe(res => {
        expect(res).toEqual(mockReqs);
      });
      const req = httpMock.expectOne(`${reqUrl}/policy/1/stage/APPLICATION`);
      expect(req.request.method).toBe('GET');
      req.flush(mockReqs);
    });
  });

  describe('uploadDocument', () => {
    it('should POST a file with FormData to the upload endpoint', () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      service.uploadDocument(mockFile, 5, null, 'ID_PROOF', 1).subscribe(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(`${baseUrl}/upload`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTrue();

      const formData = req.request.body as FormData;
      expect(formData.get('documentType')).toBe('ID_PROOF');
      expect(formData.get('userId')).toBe('1');
      expect(formData.get('applicationId')).toBe('5');
      expect(formData.has('claimId')).toBeFalse();

      req.flush({ success: true, documentId: 101 });
    });
  });

  describe('getDocumentsByClaimId', () => {
    it('should GET documents for a claim', () => {
      service.getDocumentsByClaimId(10).subscribe();
      const req = httpMock.expectOne(`${baseUrl}/claim/10`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getDocumentsByApplicationId', () => {
    it('should GET documents for an application', () => {
      service.getDocumentsByApplicationId(3).subscribe();
      const req = httpMock.expectOne(`${baseUrl}/application/3`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('downloadDocument', () => {
    it('should GET a document as a Blob', () => {
      const dummyBlob = new Blob(['file-content'], { type: 'application/pdf' });
      service.downloadDocument(42).subscribe(blob => {
        expect(blob).toEqual(dummyBlob);
      });
      const req = httpMock.expectOne(`${baseUrl}/download/42`);
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');
      req.flush(dummyBlob);
    });
  });
});
