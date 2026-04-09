import React, { useState, useEffect, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    let message = "알 수 없는 오류가 발생했습니다.";
    
    try {
      const parsed = JSON.parse(error?.message || "");
      if (parsed.error && parsed.error.toLowerCase().includes("permission")) {
        message = "권한이 부족합니다. 관리자 계정으로 로그인해 주세요.";
      }
    } catch (e) {
      // Not a JSON error
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50">
        <div className="bg-white p-12 rounded-[2rem] shadow-xl max-w-md w-full border border-neutral-100 text-center">
          <h2 className="text-2xl font-bold mb-4 tracking-tight">오류가 발생했습니다</h2>
          <p className="text-neutral-500 mb-8">{message}</p>
          <button
            onClick={() => {
              setHasError(false);
              setError(null);
              window.location.href = '/';
            }}
            className="px-8 py-3 bg-neutral-900 text-white rounded-full font-bold hover:bg-neutral-800 transition-all"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
