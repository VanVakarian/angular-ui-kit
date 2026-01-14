import { computed, Injectable, signal } from '@angular/core';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

interface DeviceInfo {
  isMobile: boolean;
  hasRearCamera: boolean;
  hasFrontCamera: boolean;
  isTouchDevice: boolean;
  platform: 'mobile' | 'tablet' | 'desktop';
}

const SCREEN_MOBILE_BREAKPOINT_PX = 768;
const KEYBOARD_DETECTION_HEIGHT_THRESHOLD_PX = 150;
const KEYBOARD_CLOSE_DEBOUNCE_MS = 150;

@Injectable({
  providedIn: 'root',
})
export class DeviceInfoService {
  public readonly isMobileScreen$$ = signal(false);
  public readonly isDesktopScreen$$ = computed(() => !this.isMobileScreen$$());

  public readonly isMobileDevice$$ = computed(() => this.isDeviceMobile());
  public readonly isDesktopDevice$$ = computed(() => !this.isDeviceMobile());

  public readonly hasCameras$$ = computed(() => this.shouldShowCameraButton());

  public readonly isKeyboardOpen$$ = signal(false);

  private deviceInfo: DeviceInfo | null = null;
  private initialViewportHeight: number = 0;
  private keyboardCloseTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.setupResizeListener();
    this.setupKeyboardDetection();
  }

  private setupResizeListener(): void {
    fromEvent(window, 'resize')
      .pipe(
        startWith(null),
        map(() => window.innerWidth < SCREEN_MOBILE_BREAKPOINT_PX),
        distinctUntilChanged()
      )
      .subscribe((isMobile) => {
        this.isMobileScreen$$.set(isMobile);
      });
  }

  private setupKeyboardDetection(): void {
    if (typeof window === 'undefined') return;

    const visualViewport = window.visualViewport;
    if (!visualViewport) return;

    this.initialViewportHeight = visualViewport.height;

    const checkKeyboardState = () => {
      const currentHeight = visualViewport.height;
      const heightDifference = this.initialViewportHeight - currentHeight;
      const isOpen = heightDifference > KEYBOARD_DETECTION_HEIGHT_THRESHOLD_PX;

      if (isOpen) {
        if (this.keyboardCloseTimeout) {
          clearTimeout(this.keyboardCloseTimeout);
          this.keyboardCloseTimeout = null;
        }
        this.isKeyboardOpen$$.set(true);
      } else {
        if (this.keyboardCloseTimeout) {
          clearTimeout(this.keyboardCloseTimeout);
        }
        this.keyboardCloseTimeout = setTimeout(() => {
          this.isKeyboardOpen$$.set(false);
          this.keyboardCloseTimeout = null;
        }, KEYBOARD_CLOSE_DEBOUNCE_MS);
      }
    };

    visualViewport.addEventListener('resize', checkKeyboardState);
    visualViewport.addEventListener('scroll', checkKeyboardState);
  }

  public shouldShowCameraButton(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const isLaptop =
      userAgent.includes('macintosh') ||
      userAgent.includes('windows') ||
      (userAgent.includes('linux') && !userAgent.includes('android'));

    const isTouchDevice = this.isTouchDevice();
    if (isLaptop && !isTouchDevice) {
      return false;
    }

    const isMobile = this.isDeviceMobile();
    const hasMediaDevices = Boolean(navigator.mediaDevices?.getUserMedia);
    return (isMobile || isTouchDevice) && hasMediaDevices;
  }

  public isDeviceMobile(): boolean {
    if (this.deviceInfo?.isMobile !== undefined) {
      return this.deviceInfo.isMobile;
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile =
      /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile|crios|fxios/.test(
        userAgent
      ) && !/ipad|tablet/.test(userAgent);

    if (!this.deviceInfo) {
      this.deviceInfo = {
        isMobile,
        hasRearCamera: false,
        hasFrontCamera: false,
        isTouchDevice: this.isTouchDevice(),
        platform: isMobile ? 'mobile' : /ipad|tablet/.test(userAgent) ? 'tablet' : 'desktop',
      };
    }

    return isMobile;
  }

  public isTouchDevice(): boolean {
    if (this.deviceInfo?.isTouchDevice !== undefined) {
      return this.deviceInfo.isTouchDevice;
    }

    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  public async checkCameraAvailability(): Promise<void> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');

      const hasRearCamera = videoDevices.some(
        (device) =>
          device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear')
      );
      const hasFrontCamera = videoDevices.some(
        (device) =>
          device.label.toLowerCase().includes('front') ||
          device.label.toLowerCase().includes('user')
      );

      if (this.deviceInfo) {
        this.deviceInfo.hasRearCamera = hasRearCamera;
        this.deviceInfo.hasFrontCamera = hasFrontCamera;
      }
    } catch (error) {
      console.error('Error checking camera availability:', error);
    }
  }

  public getDeviceInfo(): DeviceInfo {
    if (!this.deviceInfo) {
      this.isDeviceMobile();
    }
    return this.deviceInfo!;
  }
}
