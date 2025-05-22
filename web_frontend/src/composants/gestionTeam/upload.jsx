import { Upload } from "lucide-react"; // Icône Lucide
import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API;

function UploadLogo({ onUploadSuccess }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("logo", file); // 'logo' doit correspondre à upload.single('logo')

    try {
      const res = await axios.post(`${API}/api/teams/upload-logo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        const imagePath = res.data.path;
        onUploadSuccess(imagePath); // tu peux le mettre dans le state de ton form
      }
    } catch (err) {
      console.error("Erreur upload image :", err);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-white">
        <Upload size={20} />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        Choisir une image
      </label>

      {file && (
        <button
          onClick={uploadImage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Envoyer l'image
        </button>
      )}
    </div>
  );
}

export default UploadLogo;
