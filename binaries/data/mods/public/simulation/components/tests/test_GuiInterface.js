Engine.LoadComponentScript("interfaces/Attack.js");
Engine.LoadComponentScript("interfaces/Builder.js");
Engine.LoadComponentScript("interfaces/DamageReceiver.js");
Engine.LoadComponentScript("interfaces/Foundation.js");
Engine.LoadComponentScript("interfaces/GarrisonHolder.js");
Engine.LoadComponentScript("interfaces/Health.js");
Engine.LoadComponentScript("interfaces/Identity.js");
Engine.LoadComponentScript("interfaces/RallyPoint.js");
Engine.LoadComponentScript("interfaces/ResourceGatherer.js");
Engine.LoadComponentScript("interfaces/ResourceSupply.js");
Engine.LoadComponentScript("interfaces/TrainingQueue.js");
Engine.LoadComponentScript("GuiInterface.js");

var cmp = ConstructComponent(SYSTEM_ENTITY, "GuiInterface");

AddMock(SYSTEM_ENTITY, IID_PlayerManager, {
	GetNumPlayers: function() { return 2; },
	GetPlayerByID: function(id) { TS_ASSERT(id === 0 || id === 1); return 100+id; }
});

AddMock(SYSTEM_ENTITY, IID_TemplateManager, {
	GetCurrentTemplateName: function(ent) { return "example"; },
	GetTemplate: function(name) { return ""; },
});

AddMock(SYSTEM_ENTITY, IID_RangeManager, {
	GetLosVisibility: function(ent, player) { return "visible"; },
});


AddMock(100, IID_Player, {
	GetName: function() { return "Player 1"; },
	GetCiv: function() { return "gaia"; },
	GetColour: function() { return { r: 1, g: 1, b: 1, a: 1}; },
	GetPopulationCount: function() { return 10; },
	GetPopulationLimit: function() { return 20; },
	GetResourceCounts: function() { return { food: 100 }; },
	IsTrainingQueueBlocked: function() { return false; },
	GetState: function() { return "active"; },
});

AddMock(101, IID_Player, {
	GetName: function() { return "Player 2"; },
	GetCiv: function() { return "celt"; },
	GetColour: function() { return { r: 1, g: 0, b: 0, a: 1}; },
	GetPopulationCount: function() { return 40; },
	GetPopulationLimit: function() { return 30; },
	GetResourceCounts: function() { return { food: 200 }; },
	IsTrainingQueueBlocked: function() { return false; },
	GetState: function() { return "active"; },
});

TS_ASSERT_UNEVAL_EQUALS(cmp.GetSimulationState(), {
	players: [
		{
			name: "Player 1",
			civ: "gaia",
			color: { r:1, g:1, b:1, a:1 },
			popCount: 10,
			popLimit: 20,
			resourceCounts: { food: 100 },
			trainingQueueBlocked: false,
			state: "active",
		},
		{
			name: "Player 2",
			civ: "celt",
			color: { r:1, g:0, b:0, a:1 },
			popCount: 40,
			popLimit: 30,
			resourceCounts: { food: 200 },
			trainingQueueBlocked: false,
			state: "active",
		}
	]
});


AddMock(10, IID_Position, {
	GetPosition: function() {
		return {x:1, y:2, z:3};
	},
	IsInWorld: function() {
		return true;
	},
});

AddMock(10, IID_Health, {
	GetHitpoints: function() { return 50; },
	GetMaxHitpoints: function() { return 60; },
	IsRepairable: function() { return false; },
});

AddMock(10, IID_Builder, {
	GetEntitiesList: function() {
		return ["test1", "test2"];
	}
});

var state = cmp.GetEntityState(-1, 10);
TS_ASSERT_UNEVAL_EQUALS(state, {
	id: 10,
	template: "example",
	position: {x:1, y:2, z:3},
	hitpoints: 50,
	maxHitpoints: 60,
	needsRepair: false,
	buildEntities: ["test1", "test2"],
	visibility: "visible",
});
