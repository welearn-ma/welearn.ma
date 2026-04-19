import { FileDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadableFile {
  name: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface PDFDownloadComponentProps {
  files: DownloadableFile[];
  title?: string;
  description?: string;
}

export function PDFDownloadComponent({
  files,
  title = "Documents à télécharger",
  description,
}: PDFDownloadComponentProps) {
  const handleDownload = (filename: string) => {
    // In a real application, you would trigger a download here
    // This is a placeholder that would be connected to your backend
    const link = document.createElement("a");
    link.href = `/documents/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-sans text-2xl font-bold text-foreground mb-2">
          {title}
        </h3>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {files.map((file) => (
          <div
            key={file.name}
            className="group p-6 border border-border rounded-lg hover:border-primary hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <FileDown className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">
                  {file.label}
                </h4>
                {file.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {file.description}
                  </p>
                )}
                <Button
                  onClick={() => handleDownload(file.name)}
                  variant="outline"
                  size="sm"
                  className="text-primary hover:bg-primary/10"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DownloadCTAProps {
  title: string;
  description: string;
  files: DownloadableFile[];
}

export function DownloadCTA({ title, description, files }: DownloadCTAProps) {
  return (
    <section className="py-16 bg-secondary rounded-2xl">
      <div className="px-6">
        <div className="max-w-2xl mb-8">
          <h3 className="font-sans text-2xl md:text-3xl font-bold text-foreground mb-3">
            {title}
          </h3>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-3">
          {files.map((file) => (
            <button
              key={file.name}
              onClick={() => {
                const link = document.createElement("a");
                link.href = `/documents/${file.name}`;
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="w-full text-left p-4 bg-white rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center justify-between group"
            >
              <div>
                <div className="font-medium">{file.label}</div>
                {file.description && (
                  <div className="text-sm text-muted-foreground group-hover:text-white/80 mt-1">
                    {file.description}
                  </div>
                )}
              </div>
              <FileDown className="h-5 w-5 shrink-0 ml-4 group-hover:translate-y-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DownloadSuccess() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="p-3 bg-primary/10 rounded-full mb-4">
        <CheckCircle className="h-8 w-8 text-primary" />
      </div>
      <h3 className="font-sans font-bold text-foreground mb-2">
        Téléchargement en cours...
      </h3>
      <p className="text-muted-foreground text-sm">
        Votre fichier devrait être téléchargé automatiquement. Si ce n'est pas
        le cas, cliquez à nouveau sur le lien de téléchargement.
      </p>
    </div>
  );
}
