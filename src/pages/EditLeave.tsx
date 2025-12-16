import MainFrame from "./MainFrame";

const EditLeave: React.FC = () => {
  return (
    <MainFrame>
      <main className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Input CPDP</h2>

        <div style={{ border: "1px solid #ccc", overflow: "hidden" }}>
          <iframe
            src={
              "https://ptptmn-my.sharepoint.com/personal/ahmad_baehaqi_pertamina_com/_layouts/15/Doc.aspx?sourcedoc={8D5B3A45-AB9A-4E62-B401-F04104A4837F}&action=edit"
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

export default EditLeave;
