const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    inputText: 0x01,
    power:100,
    temperature:20,
    humility:0,
    distance:0,
    receiveType:'',
    name: '',
    connectedDeviceId: '',
    services: {},
    characteristics: {},
    connected: true,
    logs: [],
    StartX:'110',
    StartY:'210',
    leftLooks: '',
    topLooks: '',
    //半径
    radius: '60',
    angle: '',
    count: 1
  },
  bindInput: function (e) {
    this.setData({
      inputText: e.detail.value
    })
    console.log(e.detail.value)
  },
  /********************************************************************************************************************************/
  Send1: function () {
    var that = this
    if (that.data.connected) {

      var buffer = new ArrayBuffer(1);
      var dataview = new DataView(buffer);
      dataview.setInt8(0,0x01);
      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.services[2].uuid,
        characteristicId: that.data.characteristics[0].uuid,
        value: buffer,
        success: function (res) {
          console.log('发送成功')
        }
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '蓝牙已断开',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },
/********************************************************************************************************************************/
  Send2: function () {
    var that = this
    if (that.data.connected) {
      var buffer = new ArrayBuffer(1);
      var dataview = new DataView(buffer);
      dataview.setInt8(0,0x02);

      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.services[2].uuid,
        characteristicId: that.data.characteristics[0].uuid,
        value: buffer,
        success: function (res) {
          console.log('发送成功')
        }
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '蓝牙已断开',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  }, 

  /********************************************************************************************************************************/ 
   Send3: function () {
    var that = this
    if (that.data.connected) {
      var buffer = new ArrayBuffer(1);
      var dataview = new DataView(buffer);
      dataview.setInt8(0,0x03);

      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.services[2].uuid,
        characteristicId: that.data.characteristics[0].uuid,
        value: buffer,
        success: function (res) {
          console.log('发送成功')
        }
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '蓝牙已断开',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },

  Send: function(msg){
    var that = this
    if (that.data.connected) {
      var buffer = new ArrayBuffer(1);
      var dataview = new DataView(buffer);
      dataview.setInt8(0,msg);

      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.services[2].uuid,
        characteristicId: that.data.characteristics[0].uuid,
        value: buffer,
        success: function (res) {
          console.log('发送成功')
        }
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '蓝牙已断开',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      name: options.name,
      connectedDeviceId: options.connectedDeviceId
    })
    wx.getBLEDeviceServices({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log(res.services)
        that.setData({
          services: res.services
        })

        wx.getBLEDeviceCharacteristics({
          deviceId: options.connectedDeviceId,
          serviceId: res.services[2].uuid,
          success: function (res) {
            console.log(res.characteristics)
            that.setData({
              characteristics: res.characteristics
            })

            wx.notifyBLECharacteristicValueChange({
              state: true,
              deviceId: options.connectedDeviceId,
              serviceId: that.data.services[2].uuid,
              characteristicId: that.data.characteristics[0].uuid,
              success: function (res) {
                console.log('启用notify成功',res.errMsg)
              }
            })


            
          }
        })
      }
    })
    wx.onBLEConnectionStateChange(function (res) {
      console.log(res.connected)
      that.setData({
        connected: res.connected
      })
    })
    wx.onBLECharacteristicValueChange(function (res) {
      var receiveText = app.buf2string(res.value)
      var dataView = new DataView(res.value)
      
      console.log(res)
      if(receiveText[0] == '1')
      {
        console.log('a');
        that.setData({
          power : dataView.getUint8(1)
        })

      }
      else if(receiveText[0] == '2')
      {
        that.setData({
          temperature :  dataView.getUint8(1)
        })

      }
      else if(receiveText[0] == '3')
      {
        that.setData({
          humility :  dataView.getUint8(1)
        })
        
      }
      else if(receiveText[0] == '4')
      {
        that.setData({
          distance :  dataView.getUint8(1)
        })
        
      }
      console.log('接收到数据：' + receiveText)

    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  }

  ,
  //摇杆点击事件
  ImageTouch: function (e) {
    console.log("点击")
  },

  //拖动摇杆移动
  ImageTouchMove: function (e) {
    var self = this;
    //e.touches[0].clientX是触碰的位置，需要减40使得图片中心跟随触碰位置
    var touchX = e.touches[0].clientX - 40;
    var touchY = e.touches[0].clientY - 40;
    var movePos = self.GetPosition(touchX, touchY);
    //console.log("接触坐标：(" + touchX + "," + touchY + ")");
    // console.log("图片坐标：("+movePos.posX + "," + movePos.posY+")");
    this.data.count += 1;
    if(this.data.count > 12)
    {
      this.data.count = 1;
    if(this.data.angle >= -15 && this.data.angle < 15)
    {
      this.Send(0x10);
    }
    else if(this.data.angle >= 15 && this.data.angle < 45)
    {
      this.Send(0x11);


    }
    else if(this.data.angle >= 45 && this.data.angle < 75)
    {
      this.Send(0x12);


    }   else if(this.data.angle >= 75 && this.data.angle < 105)
    {
      this.Send(0x13);


    }   else if(this.data.angle >= 105 && this.data.angle < 135)
    {
      this.Send(0x14);
    }   else if(this.data.angle >= 135 && this.data.angle < 165)
    { 
      this.Send(0x15);


    }   else if(this.data.angle >= 165 && this.data.angle < 195)
    {
      this.Send(0x16);


    }   else if(this.data.angle >= 195 && this.data.angle < 225)
    {
      this.Send(0x17);


    }   else if(this.data.angle >= 225 && this.data.angle < 255)
    {
      this.Send(0x18);


    }   else if(this.data.angle >= 255 || this.data.angle < -75)
    {

      this.Send(0x19);

    }   else if(this.data.angle >= -75 && this.data.angle < -45)
    {
      this.Send(0x1a);


    }   else if(this.data.angle >= -45 && this.data.angle < -15)
    {
      this.Send(0x1b);
    }}
    self.setData({
      leftLooks: movePos.posX,
      topLooks: movePos.posY
    })
  },

  //松开摇杆复原
  ImageReturn: function (e) {
    var self = this;
    this.Send(0xff);

    self.setData({
      leftLooks: self.data.StartX,
      topLooks: self.data.StartY,
      angle: ""
    })
  },

  //获得触碰位置并且进行数据处理获得触碰位置与拖动范围的交点位置
  GetPosition: function (touchX, touchY) {
    var self = this;
    var DValue_X;
    var Dvalue_Y;
    var Dvalue_Z;
    var imageX;
    var imageY;
    var ratio;
    DValue_X = touchX - self.data.StartX;
    Dvalue_Y = touchY - self.data.StartY;
    Dvalue_Z = Math.sqrt(DValue_X * DValue_X + Dvalue_Y * Dvalue_Y);

    self.GetAngle(DValue_X, Dvalue_Y)
    //触碰点在范围内
    if (Dvalue_Z <= self.data.radius) {
      imageX = touchX;
      imageY = touchY;
      imageX = Math.round(imageX);
      imageY = Math.round(imageY);
      return { posX: imageX, posY: imageY };
    }

    //触碰点在范围外
    else {

      ratio = self.data.radius / Dvalue_Z;
      imageX = DValue_X * ratio + 110;
      imageY = Dvalue_Y * ratio + 210;
      imageX = Math.round(imageX);
      imageY = Math.round(imageY);
      return { posX: imageX, posY: imageY };

    }
  },

  //获取角度
  GetAngle: function (Dvalue_Y, DValue_X) {
    var self = this;
    var result = 0;
    if(DValue_X == 0 && Dvalue_Y >0)
    {
      result = 0;
    }
    else if(DValue_X == 0 && Dvalue_Y < 0)
    {
      result = 180;
    }
    else if(Dvalue_Y > 0)
    {
      var angleTan = DValue_X / Dvalue_Y;
      var ang = Math.atan(angleTan);

      var angs = ang * 180 / 3.14;
      result = Math.round(angs);

    }
    else if(Dvalue_Y < 0)
    {

      var angleTan = DValue_X / Dvalue_Y;
      var ang = Math.atan(angleTan);

      var angs = ang * 180 / 3.14;
      result = Math.round(angs) + 180;
    }
    //console.log(result);
    self.setData({
      angle: result
    })
  

  }
})