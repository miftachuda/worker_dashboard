import MainFrame from "./MainFrame";

const EditChemical: React.FC = () => {
  return (
    <MainFrame>
      <main className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Edit Chemical</h2>

        <div style={{ border: "1px solid #ccc", overflow: "hidden" }}>
          <iframe
            src={
              "https://ptptmn-my.sharepoint.com/:x:/r/personal/ahmad_baehaqi_pertamina_com/_layouts/15/Doc.aspx?sourcedoc=%7B315D75A6-989A-4888-BA97-5F639D2D5940%7D&file=Readiness%20Pelumas%2CChemical%20%26%20Material%20LOC%20II.xlsx&action=default&mobileredirect=true"
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

export default EditChemical;
