// @ts-nocheck
import CardVib from "./CardVib";

function Iterator({ vibdata }) {
  // Protect against undefined/null
  const hasData = Array.isArray(vibdata) && vibdata.length > 0;

  return (
    <div className="flex flex-row">
      {hasData ? (
        vibdata.map((element, i) => (
          <CardVib data={element} maindata={vibdata} key={element.id} i={i} />
        ))
      ) : (
        <div className="w-screen pt-40 pb-56 text-blue-300 text-7xl text-center bg-indigo-50">
          <p>🙄🙄🙄🙄</p>
          <p>No Record Found</p>
        </div>
      )}
    </div>
  );
}

export default Iterator;
