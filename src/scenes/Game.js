import Phaser from '../lib/phaser.js'
import Carrot from '../game/carrot.js'

export default class Game extends Phaser.Scene
{  
  
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms
  
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player
  
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors
  
  /** @type {Phaser.Physics.Arcade.Group} */
  carrots
  
  /**
  * @param {Phaser.GameObjects.Sprite} sprite
  */
  addCarrotAbove(sprite)
  {
    const y = sprite.y - sprite.displayHeight
    
    /** @type {Phaser.Physics.Arcade.Sprite} */
    const carrot = this.carrots.get(sprite.x, y, 'carrot')
    
    this.add.existing(carrot)
    
    // update the physics body size
    carrot.body.setSize(carrot.width, carrot.height)
    
    return carrot
  }
  
  
  constructor()
  {
    super('game')
  }
  
  preload()
  {
    this.load.image('background', 'assets/bg_layer1.png')    
    this.load.image('platform', 'assets/ground_grass.png')
    
    this.load.image('bunny-stand', 'assets/bunny1_stand.png')
    
    this.cursors = this.input.keyboard.createCursorKeys()
    
    this.load.image('carrot', 'assets/carrot.png')
  }
  
  create()
  {
    
    this.add.image(240,320, 'background')
    .setScrollFactor(1, 0)
    this.platforms = this.physics.add.staticGroup()
    
    this.carrots = this.physics.add.group({
      classType: Carrot
    })
    this.carrots.get(240, 320, 'carrot')    
    
    for (let i = 0; i < 5; ++i)
    {
      const x = Phaser.Math.Between(50, 550)
      const y = 150 * i 
      
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, 'platform')
      platform.scale = 0.3
      
      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body
      body.updateFromGameObject()     
    }
    
    this.player = this.physics.add.sprite(240, 320, 'bunny-stand')
    .setScale(1)
    
    this.physics.add.collider(this.platforms, this.player)    
    
    this.player.body.checkCollision.up = false
    this.player.body.checkCollision.left = false
    this.player.body.checkCollision.right = false
    
    this.cameras.main.startFollow(this.player)
    
    this.cameras.main.setDeadzone(this.scale.width * 1.5)
    
    this.physics.add.collider(this.platforms, this.carrots)

    this.physics.add.overlap(
      this.player,
      this.carrots,
      this.handleCollectCarrot, // called on overlap
      undefined,
      this
      )
      
    }
    
    
    update(t, dt)
    {     
      this.platforms.children.iterate(child => {
        /** @type {Phaser.Physics.Arcade.Sprite} */
        const platform = child
        
        const scrollY = this.cameras.main.scrollY
        if (platform.y >= scrollY + 700)
        {
          platform.y = scrollY - Phaser.Math.Between(-30, -10)
          platform.x = Phaser.Math.Between(80, 420)
          platform.body.updateFromGameObject()
          
          this.addCarrotAbove(platform)
          
        }
        
        
      })
      
      const touchingDown = this.player.body.touching.down
      
      if (touchingDown)
      {
        this.player.setVelocityY(-1500)
      }
      // left and right input logic
      if (this.cursors.left.isDown && !touchingDown)
      {
        this.player.setVelocityX(-500)
      }
      else if (this.cursors.right.isDown && !touchingDown)
      {
        this.player.setVelocityX(500)
      }
      else
      {
        // stop movement if not left or right
        this.player.setVelocityX(0)
      }
      
      this.horizontalWrap(this.player)
      
    }

    handleCollectCarrot(player, carrot) {
      // Masquer la carotte et désactiver son corps physique
      carrot.setVisible(false);
      carrot.body.enable = false;    
   
    }

    horizontalWrap(sprite)
    {
      const halfWidth = sprite.displayWidth * 0.5
      const gameWidth = this.scale.width
      if (sprite.x < -halfWidth)
      {
        sprite.x = gameWidth + halfWidth
      } else if (sprite.x > gameWidth + halfWidth)
      {
        sprite.x = -halfWidth
      }
    }

    

    
  }