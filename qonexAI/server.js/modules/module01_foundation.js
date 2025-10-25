,,,js
// Module 01 – Foundation
module.exports = function foundationModule(app) {
  app.get("/module/1", (req, res) => {
    res.json({
      id: 1,
      name: "Project Foundation",
      status: "active",
      description:
        "Establishes the vision, logic, and high-level architecture of Quantum Trader AI.",
    });
  });
};
