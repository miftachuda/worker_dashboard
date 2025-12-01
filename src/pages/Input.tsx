import MainFrame from "./MainFrame";

const LINKS = [
  {
    title: "CPDP",
    description: "Link untuk memasukkan data log CPDP per orang",
    url: "https://forms.cloud.microsoft/pages/responsepage.aspx?id=Zyu7FNNMz0Klw6Y6r1JFrC1zaJ_SJYpDpO9KXpN8aixUQVhXNlBHT1BXNlVDS1U1OVowOTZYTjBDVS4u&route=shorturl",
  },
  {
    title: "RKAP Perbaikan",
    description: "Link untuk mengupdate RKAP Perbaikan",
    url: "https://ptptmn-my.sharepoint.com/:x:/g/personal/miftachul_huda_pertamina_com/IQCW-0XZl42QRooysizThjvIAeVKkXt-zEfWUcwnFru1JgQ?e=AgIYDn",
  },
  {
    title: "Vacancy Pekerja LOC II",
    description: "Link Excel untuk mengupdate data vacancy pekerja LOC II",
    url: "https://ptptmn-my.sharepoint.com/:x:/g/personal/miftachul_huda_pertamina_com/IQA_lJbrIpmmRqcSlSN3Ve9YAf-OchwKVXfzkKWXpTwWGS4?e=aOJWD6",
  },
  {
    title: "BFO Pekerja LOC II",
    description: "Link Excel untuk mengupdate data BFO pekerja LOC II",
    url: "https://ptptmn-my.sharepoint.com/:x:/g/personal/miftachul_huda_pertamina_com/IQBQ06pi1qobSIegdgHKroEvAeoeN-TyFH8xtiV7R_nNAOc?e=z1EwYA",
  },
  {
    title: "Readiness Pelumas, Chemical & Material LOC II",
    description:
      "Link Excel untuk mengupdate Readiness Pelumas, Chemical & Material LOC II",
    url: "https://ptptmn-my.sharepoint.com/:x:/r/personal/ahmad_baehaqi_pertamina_com/_layouts/15/Doc.aspx?sourcedoc=%7B315D75A6-989A-4888-BA97-5F639D2D5940%7D&file=Readiness%20Pelumas%2CChemical%20%26%20Material%20LOC%20II.xlsx&action=default&mobileredirect=true",
  },
];

const Input: React.FC = () => {
  return (
    <MainFrame>
      <main className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Input Data Links</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LINKS.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 border rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all group"
            >
              <h3 className="text-lg font-semibold group-hover:text-blue-600">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </a>
          ))}
        </div>
      </main>
    </MainFrame>
  );
};

export default Input;
