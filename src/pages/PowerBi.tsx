import MainFrame from "./MainFrame";

const PowerBi: React.FC = () => {
  return (
    <MainFrame>
      <div className="w-full h-full">
        <iframe
          title="Power BI Report"
          width="100%"
          height="900"
          src="https://app.powerbi.com/reportEmbed?reportId=460f5216-c08c-4231-8e89-9468da8a1fba&autoAuth=true"
          frameBorder={0}
          allowFullScreen={true}
        />
      </div>
    </MainFrame>
  );
};

export default PowerBi;
