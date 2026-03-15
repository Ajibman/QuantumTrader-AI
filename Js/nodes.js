(function () {

  function makeNode(id, description) {
    return {
      id,
      description,
      run(context) {
        return {
          status: "ok",
          message: `Node ${id} active`,
          page: context.page,
          mode: context.mode
        };
      }
    };
  }

  // Register nodes 01–15
  for (let i = 1; i <= 15; i++) {
    window.CCLM2.registerNode(
      i,
      makeNode(i, `Cognitive Node ${String(i).padStart(2, "0")}`)
    );
  }

})();
