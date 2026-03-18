import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService, Toast } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('should add a toast to the signal', () => {
      service.show('Test message', 'info');
      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].message).toBe('Test message');
      expect(service.toasts()[0].type).toBe('info');
    });

    it('should auto-remove toast after duration', fakeAsync(() => {
      service.show('Auto remove', 'success', 1000);
      expect(service.toasts().length).toBe(1);

      tick(1000);
      expect(service.toasts().length).toBe(0);
    }));

    it('should auto-assign incrementing ids to each toast', () => {
      service.show('First');
      service.show('Second');
      const toasts = service.toasts();
      expect(toasts[0].id).toBeLessThan(toasts[1].id);
    });
  });

  describe('convenience methods', () => {
    it('should create success toast', () => {
      service.success('Great job!');
      expect(service.toasts()[0].type).toBe('success');
      expect(service.toasts()[0].message).toBe('Great job!');
    });

    it('should create error toast', () => {
      service.error('Something failed');
      expect(service.toasts()[0].type).toBe('error');
    });

    it('should create warning toast', () => {
      service.warning('Be careful');
      expect(service.toasts()[0].type).toBe('warning');
    });

    it('should create info toast', () => {
      service.info('FYI message');
      expect(service.toasts()[0].type).toBe('info');
    });
  });

  describe('remove', () => {
    it('should remove a specific toast by id', () => {
      service.show('First');
      service.show('Second');
      const toastId = service.toasts()[0].id;
      service.remove(toastId);
      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].message).toBe('Second');
    });

    it('should not crash if id does not exist', () => {
      service.show('Some toast');
      service.remove(9999);
      expect(service.toasts().length).toBe(1);
    });
  });
});
