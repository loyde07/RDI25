import AdminMatchManager from "../components/AdminMatchManager";

function AdminTournoiPage() {
  return (
    <div>
      <h1>Gestion des matchs</h1>
      <AdminMatchManager tournoisId="TON_ID_DU_TOURNOI" />
    </div>
  );
}

export default AdminTournoiPage;
