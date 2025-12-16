import MainFrame from "./MainFrame";

const InputCPDP: React.FC = () => {
  return (
    <MainFrame>
      <main className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Input CPDP</h2>

        <div style={{ border: "1px solid #ccc", overflow: "hidden" }}>
          <iframe
            src={
              "https://forms.cloud.microsoft/pages/responsepage.aspx?id=Zyu7FNNMz0Klw6Y6r1JFrC1zaJ_SJYpDpO9KXpN8aixUQVhXNlBHT1BXNlVDS1U1OVowOTZYTjBDVS4u&route=shorturl"
            }
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: "none" }}
            allowFullScreen
          />
        </div>
      </main>
    </MainFrame>
  );
};

export default InputCPDP;
