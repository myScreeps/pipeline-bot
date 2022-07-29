import { runConstructionService } from 'construction-service/manager';
import { PipelinesByRoom } from 'pipeline/byRoom';
import { initializeRoom } from 'pipeline/initializeRoom';
import 'prototypes';
import { planStructures } from 'structures/plan';
import { runTaxiService } from 'taxi-service/manager';
import 'ts-polyfill/lib/es2019-array';

export const loop = () => {
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  // gets first priority with spawns
  runTaxiService();

  for (const room in Game.rooms) {
    initializeRoom(room);
    const pipelines = PipelinesByRoom.get(room) ?? [];
    let spawned = false;
    pipelines.forEach(p => {
      p.survey();
      if (!spawned) spawned ||= p.runSpawn();
      p.run();
      p.visualize();
    });

    planStructures(room);
  }

  // gets last priority with spawns
  runConstructionService();
  // console.log('Runtime', Game.cpu.getUsed(), Game.cpu.bucket);
};
