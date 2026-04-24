import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, AlertCircle } from 'lucide-react';

export default function ResumeUploader({ onFile, loading, error }) {
  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) onFile(accepted[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    disabled: loading,
  });

  return (
    <div style={{ width: '100%' }}>
      <motion.div
        {...getRootProps()}
        whileHover={!loading ? { scale: 1.01 } : {}}
        whileTap={!loading ? { scale: 0.99 } : {}}
        style={{
          border: `2px dashed ${isDragActive ? '#00d4ff' : isDragReject ? '#ef4444' : 'rgba(255,255,255,0.15)'}`,
          borderRadius: '16px',
          padding: '48px 32px',
          textAlign: 'center',
          cursor: loading ? 'not-allowed' : 'pointer',
          background: isDragActive
            ? 'rgba(0,212,255,0.06)'
            : 'rgba(255,255,255,0.02)',
          transition: 'all 0.3s ease',
          boxShadow: isDragActive ? '0 0 30px rgba(0,212,255,0.15)' : 'none',
          opacity: loading ? 0.6 : 1,
        }}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
            >
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                border: '3px solid rgba(0,212,255,0.2)',
                borderTop: '3px solid #00d4ff',
                animation: 'spin 1s linear infinite',
              }} />
              <p style={{ color: '#9ca3af', fontSize: '15px', margin: 0 }}>Processing your resume…</p>
            </motion.div>
          ) : isDragActive ? (
            <motion.div
              key="dragging"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
            >
              <div style={{ width: '60px', height: '60px', background: 'rgba(0,212,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={28} color="#00d4ff" />
              </div>
              <p style={{ color: '#00d4ff', fontSize: '16px', fontWeight: 600, margin: 0 }}>Drop it here!</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
            >
              <div style={{
                width: '72px', height: '72px',
                background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(37,99,235,0.15))',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(0,212,255,0.2)',
              }}>
                <FileText size={32} color="#00d4ff" />
              </div>
              <div>
                <p style={{ color: '#e5e5e5', fontSize: '16px', fontWeight: 600, margin: '0 0 6px' }}>
                  Drag & drop your resume here
                </p>
                <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                  or <span style={{ color: '#00d4ff', fontWeight: 600 }}>browse files</span> to upload
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
                {['PDF only', 'Max 5MB', 'Any domain'].map(tag => (
                  <span key={tag} style={{
                    fontSize: '11px', color: '#6b7280',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '3px 10px', borderRadius: '999px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>{tag}</span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              marginTop: '12px',
              padding: '12px 16px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', gap: '8px',
              color: '#f87171', fontSize: '13px',
            }}
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
