import MainFrame from "./MainFrame";

const InputCPDP: React.FC = () => {
  return (
    <MainFrame>
      <main className="p-6 flex flex-col h-screen overflow-hidden gap-4">
        <h2 className="text-2xl font-bold">Edit RKAP</h2>

        <iframe
          className="w-full flex-1"
          scrolling="no"
          src="https://ptptmn-my.sharepoint.com/personal/miftachul_huda_pertamina_com/_layouts/15/Doc.aspx?sourcedoc={d945fb96-8d97-4690-8a32-b22cd3863bc8}&action=embedview&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True"
        ></iframe>
      </main>
    </MainFrame>
  );
};

export default InputCPDP;
