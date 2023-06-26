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
  
  /** @type {Phaser.GameObjects.Text} */
  carrotsCollectedText
  
  /**
  * @param {Phaser.GameObjects.Sprite} sprite
  */
  addCarrotAbove(sprite)
  {
    const y = sprite.y - sprite.displayHeight
    
    /** @type {Phaser.Physics.Arcade.Sprite} */
    
    
    this.add.existing(carrot)
    
    // update the physics body size
    carrot.body.setSize(carrot.width, carrot.height)
    
    return carrot
  }
  
  
  constructor()
  {
    super('game')
  }
  
  init()
  {
    this.carrotsCollected = 0
  }
  
  
  preload()
  {
    this.load.spritesheet('leftleft', 'assets/leftleft.png')

    this.load.image('background', 'assets/bg_layer1.png')    
    this.load.image('platform', 'assets/ground_grass.png')
    
    this.load.image('bunny-stand', 'assets/bunny1_stand.png')    
    
    this.load.image('bunny-right1', 'assets/right1.png')
    this.load.image('bunny-right2', 'assets/right2.png')
    this.load.image('bunny-left1', 'assets/left1.png')
    this.load.image('bunny-left2', 'assets/left2.png')
    
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
    
    
    for (let i = 0; i < 5; ++i)
    {
      const x = Phaser.Math.Between(80, 400)
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
      
      // Initialiser le compteur à 10
      this.counter = 10;
      
      // Définir l'intervalle de temps initial entre chaque décrémentation du compteur
      this.interval = 1000;
      
      // Définir une fonction pour décrémenter le compteur et mettre à jour l'affichage
      this.decrementCounter = () => {
        // Décrémenter le compteur
        this.counter--;
        
        // Mettre à jour l'affichage du compteur
        this.carrotsCollectedText.text = `Death Countdown: ${this.counter}`;
        
        // Vérifier si le compteur a atteint 0
        if (this.counter === 0) {
          // Si oui, démarrer la scène game-over
          this.scene.start('game-over');
        } else {
          // Sinon, réduire l'intervalle de temps entre chaque décrémentation du compteur
          this.interval *= 0.98;
          
          // Appeler la fonction decrementCounter après le nouvel intervalle de temps
          setTimeout(this.decrementCounter, this.interval);
        }
      };
      
      // Appeler la fonction decrementCounter après l'intervalle de temps initial
      setTimeout(this.decrementCounter, this.interval);
      
      
      
      
      const style = { fontFamily: 'plasdrip', fontSize: 40, color: '#FF1F1F' };
      this.carrotsCollectedText = this.add.text(240, 420, '', style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);  
      
      this.anims.create({
        key: 'left',
        frames: [
          { key: 'bunny-left1' },
          { key: 'bunny-left2' }
        ],
        frameRate: 10,
        repeat: -1
      });  
      
      this.anims.create({
        key: 'right',
        frames: [
          { key: 'bunny-right1' },
          { key: 'bunny-right2' }
        ],
        frameRate: 10,
        repeat: -1
      });
      
    }
    
    
    update(t, dt)
    {     
      this.platforms.children.iterate(child => {
        /** @type {Phaser.Physics.Arcade.Sprite} */
        const platform = child
        
        const scrollY = this.cameras.main.scrollY
        if (platform.y >= scrollY + 700)
        {
          platform.y = scrollY - Phaser.Math.Between(-50, -30)
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
        this.player.setVelocityY(-1550)    
      }
      
      // Modifier ces conditions pour vérifier si les touches Q et D sont enfoncées
      if ((this.cursors.left.isDown || keyQ.isDown))
      {
        this.player.setVelocityX(-450)
        this.player.anims.play('left', true);
      }
      else if ((this.cursors.right.isDown || keyD.isDown))
      {
        this.player.setVelocityX(450)
        this.player.anims.play('right', true);
      }
      else
      {
        this.player.setVelocityX(0)                     
      }
      
      const vx = this.player.body.velocity.x
      const vy = this.player.body.velocity.y
      
      if (vx == 0 && this.player.texture.key !== 'bunny-stand')
      {          
        this.player.setTexture('bunny-stand')
      }
      
      
      
      
      this.horizontalWrap(this.player)
      
      const bottomPlatform = this.findBottomMostPlatform()
      if (this.player.y > bottomPlatform.y + 2500)
      {
        this.scene.start('game-over')
      }
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
      this.carrotsCollected++;
      this.counter++; // Augmenter la valeur de this.counter
      const value = `Death Countdown: ${this.counter}`; // Mettre à jour la valeur de value
      this.carrotsCollectedText.text = value; // Mettre à jour l'affichage du compteur
      
      
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
    
    findBottomMostPlatform()
    {
      const platforms = this.platforms.getChildren()
      let bottomPlatform = platforms[0]
      
      for (let i = 1; i < platforms.length; ++i)
      {
        const platform = platforms[i]
        
        // discard any platforms that are above current
        if (platform.y < bottomPlatform.y)
        {
          continue
        }
        
        bottomPlatform = platform
      }
      
      return bottomPlatform
    }
    
    
    
    
    
  }