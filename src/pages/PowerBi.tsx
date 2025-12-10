import MainFrame from "./MainFrame";

const PowerBi: React.FC = () => {
  return (
    <MainFrame>
      <div className="w-full h-full">
        <iframe
          title="Power BI Report"
          width="100%"
          height="900"
          src="https://app.powerbi.com/reportEmbed?reportId=24e56228-6464-470d-a611-252a2a0ea26e&autoAuth=true"
          frameBorder={0}
          allowFullScreen={true}
        />
      </div>
    </MainFrame>
  );
};

export default PowerBi;
