import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

const STEPS = [
  { id: 'upload', label: 'Upload PDF', icon: Upload },
  { id: 'extract', label: 'Extract Text', icon: FileText },
  { id: 'analyze', label: 'AI Analysis', icon: Sparkles },
];

export default function UploadCard({ onFile, loading, uploading, analyzing, error }) {
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState('');

  const activeStep = uploading ? 0 : analyzing ? 1 : null;
  const displayError = error || localError;

  const onDrop = useCallback(async (accepted, rejected) => {
    setLocalError('');
    if (rejected.length > 0) {
      setLocalError('Only PDF files are supported. Max size: 5 MB.');
      return;
    }
    if (accepted.length > 0) {
      onFile(accepted[0]);
    }
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false),
    disabled: loading,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '520px' }}
      >
        {/* Header text */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            style={{
              width: '64px', height: '64px', margin: '0 auto 20px',
              background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(37,99,235,0.25))',
              border: '1px solid rgba(0,212,255,0.3)',
              borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <FileText size={28} color="#00d4ff" />
          </motion.div>
          <h2 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 700, color: '#e5e5e5', letterSpacing: '-0.3px' }}>
            Analyze Your Resume
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
            Get instant AI-powered feedback, ATS score, skill gaps & role fit analysis.
          </p>
        </div>

        {/* Drop zone */}
        <motion.div
          {...getRootProps()}
          whileHover={!loading ? { scale: 1.01 } : {}}
          whileTap={!loading ? { scale: 0.99 } : {}}
          style={{
            padding: '48px 32px',
            borderRadius: '20px',
            border: `2px dashed ${isDragActive || dragOver ? 'rgba(0,212,255,0.6)' : loading ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)'}`,
            background: isDragActive || dragOver
              ? 'rgba(0,212,255,0.05)'
              : loading
              ? 'rgba(255,255,255,0.02)'
              : 'rgba(22,22,22,0.5)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.25s ease',
            textAlign: 'center',
            backdropFilter: 'blur(12px)',
            boxShadow: isDragActive
              ? '0 0 40px rgba(0,212,255,0.15), inset 0 0 40px rgba(0,212,255,0.03)'
              : '0 8px 40px rgba(0,0,0,0.3)',
          }}
        >
          <input {...getInputProps()} />

          <AnimatePresence mode="wait">
            {loading ? (
              /* Loading state */
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Progress steps */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '28px' }}>
                  {STEPS.map((step, i) => {
                    const StepIcon = step.icon;
                    const done = activeStep !== null && i < activeStep;
                    const active = activeStep === i || (activeStep === null && i === 2);
                    return (
                      <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                        }}>
                          <motion.div
                            animate={active ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            style={{
                              width: '40px', height: '40px', borderRadius: '12px',
                              background: done
                                ? 'rgba(16,185,129,0.2)'
                                : active
                                ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(37,99,235,0.2))'
                                : 'rgba(255,255,255,0.04)',
                              border: done
                                ? '1px solid rgba(16,185,129,0.4)'
                                : active
                                ? '1px solid rgba(0,212,255,0.4)'
                                : '1px solid rgba(255,255,255,0.06)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            {done
                              ? <CheckCircle size={18} color="#10b981" />
                              : <StepIcon size={18} color={active ? '#00d4ff' : '#4b5563'} />
                            }
                          </motion.div>
                          <span style={{ fontSize: '10px', color: done ? '#10b981' : active ? '#00d4ff' : '#4b5563', fontWeight: 500 }}>
                            {step.label}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div style={{ width: '40px', height: '1px', background: done ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)', margin: '0 4px 18px' }} />
                        )}
                      </div>
                    );
                  })}
                </div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  style={{
                    width: '36px', height: '36px', margin: '0 auto 16px',
                    borderRadius: '50%',
                    border: '3px solid rgba(0,212,255,0.15)',
                    borderTop: '3px solid #00d4ff',
                  }}
                />
                <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                  {uploading ? 'Extracting text from your PDF…' : 'Running AI analysis (≈10 sec)…'}
                </p>
              </motion.div>
            ) : (
              /* Idle state */
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div
                  className="animate-upload-pulse"
                  style={{
                    width: '56px', height: '56px', margin: '0 auto 20px',
                    background: isDragActive
                      ? 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(37,99,235,0.35))'
                      : 'rgba(255,255,255,0.04)',
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <Upload size={24} color={isDragActive ? '#00d4ff' : '#6b7280'} />
                </motion.div>
                <p style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 600, color: isDragActive ? '#00d4ff' : '#d1d5db' }}>
                  {isDragActive ? 'Drop your resume here!' : 'Drag & drop your resume'}
                </p>
                <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#6b7280' }}>
                  or click to browse — PDF only, max 5 MB
                </p>
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary"
                  style={{ fontSize: '13px', padding: '10px 24px', pointerEvents: 'none' }}
                >
                  <Upload size={15} /> Choose PDF File
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                marginTop: '16px', padding: '12px 16px',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px',
                color: '#f87171', fontSize: '13px',
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              {displayError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px' }}>
          {['🔒 Secure Upload', '⚡ ~10 sec Analysis', '🎯 ATS Scoring'].map(label => (
            <span key={label} style={{ fontSize: '11px', color: '#4b5563', fontWeight: 500 }}>{label}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
