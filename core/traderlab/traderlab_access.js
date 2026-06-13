// core/traderlab/traderlab_controller.js

export function issueQualification({ passed }) {
  const qualification = {
    permission: {
      cpilotAllowed: Boolean(passed)
    },
    issuedAt: new Date().toISOString(),
    source: "TraderLab",
    status: passed ? "QUALIFIED" : "NOT_QUALIFIED"
  };

  localStorage.setItem(
    "qt_traderlab_qualification",
    JSON.stringify(qualification)
  );

  return qualification;
}

export function readQualification() {
  const raw = localStorage.getItem("qt_traderlab_qualification");
  return raw ? JSON.parse(raw) : null;
}
