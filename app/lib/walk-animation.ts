import type { PlayerObject } from 'skinview3d'
import { PlayerAnimation } from 'skinview3d'

export class WalkAnimation extends PlayerAnimation {
  animate(player: PlayerObject) {
    this.progress = 1.45
    const t = this.progress * 3.5

    player.skin.leftLeg.rotation.x = Math.sin(t) * 0.4
    player.skin.rightLeg.rotation.x = Math.sin(t + Math.PI) * 0.4

    player.skin.leftArm.rotation.x = Math.sin(t + Math.PI) * 0.4
    player.skin.rightArm.rotation.x = Math.sin(t) * 0.4

    const basicCapeRotationX = Math.PI * 0.1
    player.cape.rotation.x = Math.sin(t / 2.5) * 0.06 + basicCapeRotationX
  }
}
