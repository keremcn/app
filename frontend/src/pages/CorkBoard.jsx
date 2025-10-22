import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import StickyNote from '../components/StickyNote';
import ConnectionLine from '../components/ConnectionLine';
import NoteEditor from '../components/NoteEditor';
import { useToast } from '../hooks/use-toast';

// CorkBoard: Mantar tahta görünümü - notların ve bağlantıların bulunduğu ana çalışma alanı
const CorkBoard = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const boardRef = useRef(null);

  const [caseName, setCaseName] = useState('');
  const [notes, setNotes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [connectMode, setConnectMode] = useState(false);
  const [firstNoteForConnect, setFirstNoteForConnect] = useState(null);

  // Case ve notları yükle
  useEffect(() => {
    const cases = JSON.parse(localStorage.getItem('cases') || '[]');
    const currentCase = cases.find(c => c.id === caseId);
    if (currentCase) {
      setCaseName(currentCase.name);
    }

    const storedNotes = localStorage.getItem(`notes_${caseId}`);
    const storedConnections = localStorage.getItem(`connections_${caseId}`);
    
    if (storedNotes) setNotes(JSON.parse(storedNotes));
    if (storedConnections) setConnections(JSON.parse(storedConnections));
  }, [caseId]);

  // Notları kaydet
  const saveNotes = (updatedNotes) => {
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${caseId}`, JSON.stringify(updatedNotes));
  };

  // Bağlantıları kaydet
  const saveConnections = (updatedConnections) => {
    setConnections(updatedConnections);
    localStorage.setItem(`connections_${caseId}`, JSON.stringify(updatedConnections));
  };

  // Yeni not ekle
  const addNote = () => {
    const newNote = {
      id: Date.now().toString(),
      x: 100,
      y: 100,
      text: '',
      imageUrl: '',
      fileUrl: '',
      fileName: ''
    };
    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);
    setSelectedNote(newNote);
    setIsEditorOpen(true);
  };

  // Notu düzenle
  const editNote = (note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  // Notu güncelle
  const updateNote = (updatedNote) => {
    const updatedNotes = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
    saveNotes(updatedNotes);
    setIsEditorOpen(false);
  };

  // Notu sil
  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter(n => n.id !== noteId);
    saveNotes(updatedNotes);
    
    // Bu notla ilgili bağlantıları da sil
    const updatedConnections = connections.filter(
      c => c.from !== noteId && c.to !== noteId
    );
    saveConnections(updatedConnections);
    setIsEditorOpen(false);
  };

  // Not pozisyonunu güncelle (drag)
  const updateNotePosition = (noteId, x, y) => {
    const updatedNotes = notes.map(n => 
      n.id === noteId ? { ...n, x, y } : n
    );
    saveNotes(updatedNotes);
  };

  // Bağlantı modu: iki not arasında bağlantı oluştur
  const handleNoteClickForConnection = (noteId) => {
    if (!connectMode) return;

    if (!firstNoteForConnect) {
      setFirstNoteForConnect(noteId);
      toast({
        title: 'İlk not seçildi',
        description: 'Şimdi ikinci notu seçin'
      });
    } else {
      if (firstNoteForConnect === noteId) {
        toast({
          title: 'Uyarı',
          description: 'Aynı notu seçemezsiniz',
          variant: 'destructive'
        });
        return;
      }

      // Bağlantı oluştur
      const colors = ['#ef4444', '#3b82f6', '#10b981', '#a855f7', '#f97316'];
      const newConnection = {
        id: Date.now().toString(),
        from: firstNoteForConnect,
        to: noteId,
        color: colors[Math.floor(Math.random() * colors.length)]
      };

      const updatedConnections = [...connections, newConnection];
      saveConnections(updatedConnections);

      toast({
        title: 'Başarılı',
        description: 'Bağlantı oluşturuldu'
      });

      setConnectMode(false);
      setFirstNoteForConnect(null);
    }
  };

  // Bağlantıyı sil
  const deleteConnection = (connectionId) => {
    const updatedConnections = connections.filter(c => c.id !== connectionId);
    saveConnections(updatedConnections);
  };

  // Not pozisyonunu bul (bağlantı çizgisi için)
  const getNoteCenter = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return { x: 0, y: 0 };
    return { x: note.x + 100, y: note.y + 100 }; // Not boyutu 200x200, merkezi +100
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b-4 border-amber-600">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="border-amber-600 text-amber-700 hover:bg-amber-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Button>
          <h1 className="text-2xl font-bold text-amber-900">{caseName}</h1>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={addNote}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Plus className="mr-2 h-5 w-5" />
            Yeni Not
          </Button>
          <Button
            onClick={() => {
              setConnectMode(!connectMode);
              setFirstNoteForConnect(null);
            }}
            variant={connectMode ? 'default' : 'outline'}
            className={connectMode ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-600 text-blue-700 hover:bg-blue-50'}
          >
            {connectMode ? 'Bağlantı Modunu Kapat' : 'Notları Bağla'}
          </Button>
        </div>
      </div>

      {/* Cork Board - Mantar Tahta */}
      <div 
        ref={boardRef}
        className="relative w-full h-[calc(100vh-80px)] overflow-auto"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(139, 69, 19, 0.02) 0%, transparent 50%)
          `,
          backgroundColor: '#d4a574',
          backgroundSize: '100% 100%, 100% 100%, 100% 100%'
        }}
      >
        {/* İçerik container - geniş alan */}
        <div className="relative" style={{ minWidth: '3000px', minHeight: '3000px' }}>
          {/* Notlar katmanı */}
          <div className="relative" style={{ zIndex: 10 }}>
            {notes.map(note => (
              <StickyNote
                key={note.id}
                note={note}
                onEdit={editNote}
                onUpdatePosition={updateNotePosition}
                onClickForConnection={handleNoteClickForConnection}
                connectMode={connectMode}
                isHighlighted={firstNoteForConnect === note.id}
              />
            ))}
          </div>

          {/* SVG katmanı - bağlantı çizgileri için (notların ÜZERİNDE) */}
          <svg 
            className="absolute top-0 left-0" 
            width="3000"
            height="3000"
            style={{ 
              zIndex: 5,
              pointerEvents: 'visiblePainted'
            }}
          >
            {connections.map(conn => {
              const from = getNoteCenter(conn.from);
              const to = getNoteCenter(conn.to);
              return (
                <ConnectionLine
                  key={conn.id}
                  id={conn.id}
                  from={from}
                  to={to}
                  color={conn.color}
                  onDelete={deleteConnection}
                />
              );
            })}
          </svg>
        </div>

        {/* Boş durum mesajı */}
        {notes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-amber-800 opacity-50">
              <p className="text-xl font-semibold mb-2">Henüz not yok</p>
              <p className="text-sm">Başlamak için "Yeni Not" butonuna tıklayın</p>
            </div>
          </div>
        )}
      </div>

      {/* Not Düzenleme Dialog */}
      {selectedNote && (
        <NoteEditor
          note={selectedNote}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={updateNote}
          onDelete={deleteNote}
        />
      )}
    </div>
  );
};

export default CorkBoard;