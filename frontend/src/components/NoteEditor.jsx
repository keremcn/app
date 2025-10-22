import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Trash2, Save, Image, FileText } from 'lucide-react';

// NoteEditor: Not düzenleme dialog bileşeni
const NoteEditor = ({ note, isOpen, onClose, onSave, onDelete }) => {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (note) {
      setText(note.text || '');
      setImageUrl(note.imageUrl || '');
      setFileUrl(note.fileUrl || '');
      setFileName(note.fileName || '');
    }
  }, [note]);

  const handleSave = () => {
    onSave({
      ...note,
      text,
      imageUrl,
      fileUrl,
      fileName
    });
  };

  const handleDelete = () => {
    if (window.confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      onDelete(note.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-900">Not Düzenle</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Metin alanı */}
          <div className="space-y-2">
            <Label htmlFor="text" className="text-amber-900 font-semibold">Not Metni</Label>
            <Textarea
              id="text"
              placeholder="Notunuzu buraya yazın..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              className="resize-none border-amber-300 focus:border-amber-500"
            />
          </div>

          {/* Resim URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-amber-900 font-semibold flex items-center gap-2">
              <Image className="h-4 w-4" />
              Resim URL
            </Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border-amber-300 focus:border-amber-500"
            />
            {imageUrl && (
              <div className="mt-2 border-2 border-amber-200 rounded p-2">
                <img 
                  src={imageUrl} 
                  alt="Önizleme" 
                  className="max-h-40 mx-auto rounded"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <p className="hidden text-red-500 text-sm text-center">Resim yüklenemedi</p>
              </div>
            )}
          </div>

          {/* Dosya URL */}
          <div className="space-y-2">
            <Label htmlFor="fileUrl" className="text-amber-900 font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Dosya Bilgisi
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                id="fileUrl"
                type="url"
                placeholder="Dosya URL"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="border-amber-300 focus:border-amber-500"
              />
              <Input
                id="fileName"
                placeholder="Dosya adı"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="border-amber-300 focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Sil
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="border-amber-600 text-amber-700 hover:bg-amber-50">
              İptal
            </Button>
            <Button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700">
              <Save className="mr-2 h-4 w-4" />
              Kaydet
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteEditor;