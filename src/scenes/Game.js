import Phaser from '../lib/phaser.js'
import Carrot from '../game/carrot.js'

export default class Game extends Phaser.Scene
{  
  carrotsCollected = 0
  
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
      
      const style = { fontFamily: 'plasdrip', fontSize: 32, color: '#FF3F3F' };
      this.add.text(240, 10, 'Death Count: 0', style)
        .setScrollFactor(0)
        .setOrigin(0.5, 0);    
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
      const spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      const keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
      const keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
      
      const touchingDown = this.player.body.touching.down
      
      if (spaceBar.isDown && touchingDown)
      {
        this.player.setVelocityY(-1700)
      }
      
      // Modifier ces conditions pour vérifier si les touches Q et D sont enfoncées
      if ((this.cursors.left.isDown || keyQ.isDown))
      {
        this.player.setVelocityX(-500)
      }
      else if ((this.cursors.right.isDown || keyD.isDown))
      {
        this.player.setVelocityX(500)
      }
      else
      {
        this.player.setVelocityX(0)
      }
      
      this.horizontalWrap(this.player)
    }
    
    /**
    * @param {Phaser.GameObjects.Sprite} sprite
    */
    addCarrotAbove(sprite) {
      const y = sprite.y - sprite.displayHeight;
      
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const carrot = this.carrots.get(sprite.x, y, 'carrot');
      
      // Set active and visible
      carrot.setActive(true);
      carrot.setVisible(true);
      
      this.add.existing(carrot);
      
      // Update the physics body size
      carrot.body.setSize(carrot.width, carrot.height);
      
      // Make sure the body is enabled in the physics world
      this.physics.world.enable(carrot);
      
      return carrot;
    }
    
    
    handleCollectCarrot(player, carrot) {
      
      this.carrots.killAndHide(carrot)
      
      this.physics.world.disableBody(carrot.body)
      
      // increment by 1
      this.carrotsCollected++
      
      
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