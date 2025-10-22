import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Trash2, FolderOpen } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

// CaseList: Ana sayfa - tüm case'leri (proje/konu) listeler
const CaseList = () => {
  const [cases, setCases] = useState([]);
  const [newCaseName, setNewCaseName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // LocalStorage'dan case'leri yükle
  useEffect(() => {
    const stored = localStorage.getItem('cases');
    if (stored) {
      setCases(JSON.parse(stored));
    }
  }, []);

  // Yeni case oluştur
  const createCase = () => {
    if (!newCaseName.trim()) {
      toast({
        title: 'Hata',
        description: 'Lütfen bir isim girin',
        variant: 'destructive'
      });
      return;
    }

    const newCase = {
      id: Date.now().toString(),
      name: newCaseName,
      createdAt: new Date().toISOString()
    };

    const updatedCases = [...cases, newCase];
    setCases(updatedCases);
    localStorage.setItem('cases', JSON.stringify(updatedCases));
    
    // Case için boş notlar dizisi oluştur
    localStorage.setItem(`notes_${newCase.id}`, JSON.stringify([]));
    localStorage.setItem(`connections_${newCase.id}`, JSON.stringify([]));

    toast({
      title: 'Başarılı',
      description: 'Yeni case oluşturuldu'
    });

    setNewCaseName('');
    setIsDialogOpen(false);
  };

  // Case'i sil
  const deleteCase = (caseId) => {
    const updatedCases = cases.filter(c => c.id !== caseId);
    setCases(updatedCases);
    localStorage.setItem('cases', JSON.stringify(updatedCases));
    localStorage.removeItem(`notes_${caseId}`);
    localStorage.removeItem(`connections_${caseId}`);

    toast({
      title: 'Silindi',
      description: 'Case silindi'
    });
  };

  // Case'i aç
  const openCase = (caseId) => {
    navigate(`/case/${caseId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-amber-900 mb-2">Not Defterim</h1>
            <p className="text-amber-700">Fikirlerinizi organize edin</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="mr-2 h-5 w-5" />
                Yeni Case
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Case Oluştur</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Case ismi..."
                  value={newCaseName}
                  onChange={(e) => setNewCaseName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createCase()}
                />
                <Button onClick={createCase} className="w-full bg-amber-600 hover:bg-amber-700">
                  Oluştur
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cases Grid */}
        {cases.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="h-24 w-24 text-amber-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-amber-800 mb-2">Henüz case yok</h2>
            <p className="text-amber-600 mb-6">Başlamak için yeni bir case oluşturun</p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-5 w-5" />
              İlk Case'inizi Oluşturun
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((caseItem) => (
              <Card 
                key={caseItem.id} 
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-amber-200 bg-white hover:scale-105"
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span className="text-amber-900">{caseItem.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCase(caseItem.id);
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent onClick={() => openCase(caseItem.id)}>
                  <p className="text-sm text-amber-600">
                    Oluşturulma: {new Date(caseItem.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseList;