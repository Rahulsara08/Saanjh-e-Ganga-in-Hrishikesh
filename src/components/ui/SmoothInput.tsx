import React, {
  type ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export type SmoothInputProps = ComponentPropsWithoutRef<'input'> & {
  wrapperClassName?: string;
  caretClassName?: string;
  numericOnly?: boolean;
};

export const SmoothInput: React.FC<SmoothInputProps> = ({
  className,
  wrapperClassName,
  caretClassName,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  type = 'text',
  placeholder,
  numericOnly = false,
  style,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const caretX = useMotionValue(0);
  const caretOpacity = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const isControlled = value !== undefined;
  const inputValue = isControlled ? String(value) : String(internalValue);

  const springCaretX = useSpring(
    caretX,
    prefersReducedMotion
      ? { stiffness: 10000, damping: 100, mass: 0.1 }
      : { stiffness: 480, damping: 28, mass: 0.4 }
  );

  const syncMeasureSpan = () => {
    const input = inputRef.current;
    const measureSpan = measureRef.current;
    if (!input || !measureSpan) return;

    const styles = window.getComputedStyle(input);
    measureSpan.style.font = `${styles.fontStyle} ${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
    measureSpan.style.letterSpacing = styles.letterSpacing;
    measureSpan.style.fontFeatureSettings = styles.fontFeatureSettings;
    measureSpan.style.fontVariationSettings = styles.fontVariationSettings;
  };

  const measurePrefixWidth = (text: string) => {
    const input = inputRef.current;
    const measureSpan = measureRef.current;
    if (!input || !measureSpan) return null;

    syncMeasureSpan();
    measureSpan.textContent = text;

    const paddingLeft =
      parseFloat(window.getComputedStyle(input).paddingLeft) || 0;

    return text.length > 0
      ? measureSpan.offsetWidth + paddingLeft
      : paddingLeft;
  };

  const scrollCaretIntoView = (
    target: HTMLInputElement,
    absoluteWidth: number
  ) => {
    const styles = window.getComputedStyle(target);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    const maxScroll = Math.max(0, target.scrollWidth - target.clientWidth);
    const visibleRight = target.scrollLeft + target.clientWidth - paddingRight;
    const visibleLeft = target.scrollLeft + paddingLeft;

    if (absoluteWidth > visibleRight) {
      target.scrollLeft = Math.min(
        absoluteWidth - target.clientWidth + paddingRight,
        maxScroll
      );
      return;
    }

    if (absoluteWidth < visibleLeft) {
      target.scrollLeft = Math.max(0, absoluteWidth - paddingLeft);
    }
  };

  const getCaretIndex = (target: HTMLInputElement) => {
    try {
      const selectionStart = target.selectionStart ?? target.value.length;
      const selectionEnd = target.selectionEnd ?? target.value.length;

      if (selectionStart === selectionEnd) {
        return selectionStart;
      }

      return target.selectionDirection === 'backward'
        ? selectionStart
        : selectionEnd;
    } catch {
      return target.value.length;
    }
  };

  const updateCaretFromInput = (target: HTMLInputElement) => {
    let hasSelection = false;
    let caretIndex = target.value.length;

    try {
      const selectionStart = target.selectionStart ?? 0;
      const selectionEnd = target.selectionEnd ?? 0;
      hasSelection = selectionStart !== selectionEnd;
      caretIndex = getCaretIndex(target);
    } catch {
      // Type 'number' fallback
      hasSelection = false;
      caretIndex = target.value.length;
    }

    const textBeforeCaret = target.value.slice(0, caretIndex);
    const absoluteWidth = measurePrefixWidth(textBeforeCaret);
    if (absoluteWidth === null) return;

    scrollCaretIntoView(target, absoluteWidth);

    const styles = window.getComputedStyle(target);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    const caretPosition = absoluteWidth - target.scrollLeft;
    const minX = paddingLeft;
    const maxX = target.clientWidth - paddingRight;
    const isCaretVisible = caretPosition >= minX - 1 && caretPosition <= maxX + 2;

    caretX.set(Math.min(caretPosition, maxX));

    if (!isCaretVisible || hasSelection) {
      caretOpacity.set(0);
      return;
    }

    caretOpacity.set(1);
  };

  const updateCaretRef = useRef(updateCaretFromInput);
  updateCaretRef.current = updateCaretFromInput;
  const caretOpacityRef = useRef(caretOpacity);
  caretOpacityRef.current = caretOpacity;

  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement === input) {
      updateCaretRef.current(input);
    }
  }, [inputValue]);

  useEffect(() => {
    const input = inputRef.current;
    const container = containerRef.current;
    if (!input || !container) return;

    const updateCaretIfFocused = () => {
      if (document.activeElement === input) {
        updateCaretRef.current(input);
      }
    };

    const handleSelectionChange = () => {
      if (document.activeElement !== input) return;
      requestAnimationFrame(() => {
        if (document.activeElement === input) {
          updateCaretRef.current(input);
        }
      });
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.fonts?.addEventListener?.('loadingdone', updateCaretIfFocused);
    void document.fonts?.ready?.then(updateCaretIfFocused);
    input.addEventListener('scroll', updateCaretIfFocused);

    const resizeObserver = new ResizeObserver(updateCaretIfFocused);
    resizeObserver.observe(container);

    updateCaretIfFocused();

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.fonts?.removeEventListener?.('loadingdone', updateCaretIfFocused);
      input.removeEventListener('scroll', updateCaretIfFocused);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={cn(
        'relative w-full rounded-2xl bg-[#FFF9F8] border border-[#DFC48F]/70 transition-all duration-200',
        'focus-within:border-[#C6A15B] focus-within:ring-2 focus-within:ring-[#C6A15B]/20',
        wrapperClassName
      )}
    >
      <div
        ref={containerRef}
        className="relative grid grid-cols-1 p-0 items-center"
        style={{ caretColor: 'transparent' }}
      >
        <input
          {...props}
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          className={cn(
            'col-start-1 col-end-2 row-start-1 row-end-2 w-full bg-transparent px-4 py-3 outline-none',
            'text-sm sm:text-base text-[#4A4038] placeholder:text-[#A3988C]',
            className
          )}
          style={style}
          value={inputValue}
          onChange={(e) => {
            if (numericOnly) {
              const cleaned = e.target.value.replace(/[^0-9]/g, '');
              e.target.value = cleaned;
            }
            if (!isControlled) setInternalValue(e.target.value);
            onChange?.(e);
            requestAnimationFrame(() => {
              updateCaretRef.current(e.target);
            });
          }}
          onFocus={(e) => {
            caretOpacityRef.current.set(1);
            updateCaretRef.current(e.target);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            caretOpacityRef.current.set(0);
            onBlur?.(e);
          }}
        />
        <span
          ref={measureRef}
          aria-hidden
          className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre"
        />
        <motion.div
          className={cn(
            'pointer-events-none col-start-1 col-end-2 row-start-1 row-end-2 h-[1.25em] w-[2px] rounded-full self-center',
            'bg-[#C6A15B] shadow-[0_0_8px_rgba(198,161,91,0.5)]',
            caretClassName
          )}
          style={{ x: springCaretX, opacity: caretOpacity }}
        />
      </div>
    </div>
  );
};
