import { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBox({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div className="relative">
      <input
        ref={ref}
        data-testid="search-input"
        type="search"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? '输入学校名称（中英文/简称均可）'}
        className="w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-lg shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-neutral-100 px-2 py-0.5 text-sm text-neutral-500 hover:bg-neutral-200"
          aria-label="清空"
        >
          ✕
        </button>
      )}
    </div>
  );
}
