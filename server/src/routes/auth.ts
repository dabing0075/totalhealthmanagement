import { Router, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';

// 内存存储（开发环境）- 生产环境应使用数据库
interface SmsCode {
  code: string;
  expiresAt: number;
}

interface User {
  id: number;
  phone: string;
  nickname: string;
  avatar: string;
  gender: string;
  birthday: string;
  height: number;
  weight: number;
  targetWeight: number;
  signature: string;
  vipLevel: number;
  vipExpireDate: string | null;
  points: number;
}

// 内存存储
const smsCodes = new Map<string, SmsCode>();
const users = new Map<string, User>();
let userIdCounter = 1;

// 初始化测试用户
users.set('13800138000', {
  id: userIdCounter++,
  phone: '13800138000',
  nickname: '健康达人',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  gender: '女',
  birthday: '1995-06-15',
  height: 165,
  weight: 55,
  targetWeight: 50,
  signature: '追求健康生活，享受美好人生',
  vipLevel: 1,
  vipExpireDate: '2025-12-31',
  points: 256,
});

const router = Router();

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'health-app-secret-key-2024';
const JWT_EXPIRES_IN = '7d';

// 清理过期验证码（定时任务）
setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of smsCodes.entries()) {
    if (data.expiresAt < now) {
      smsCodes.delete(phone);
    }
  }
}, 60000); // 每分钟清理一次

// 发送验证码
router.post('/send-code', (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ error: '请输入正确的手机号' });
    }

    // 生成6位验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5分钟有效期

    // 保存验证码
    smsCodes.set(phone, { code, expiresAt });

    // 在开发环境直接返回验证码，生产环境应该发送短信
    const isDev = process.env.NODE_ENV !== 'production';
    
    res.json({
      success: true,
      message: isDev ? `验证码已发送（开发环境显示：${code}）` : '验证码已发送',
      devCode: isDev ? code : undefined, // 仅开发环境返回
    });
  } catch (error) {
    console.error('发送验证码失败:', error);
    res.status(500).json({ error: '发送验证码失败' });
  }
});

// 手机号登录
router.post('/login', (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ error: '手机号和验证码不能为空' });
    }

    // 验证验证码
    const storedCode = smsCodes.get(phone);
    
    if (!storedCode || storedCode.code !== code || storedCode.expiresAt < Date.now()) {
      return res.status(401).json({ error: '验证码错误或已过期' });
    }

    // 删除已使用的验证码
    smsCodes.delete(phone);

    // 查找或创建用户
    let user = users.get(phone);
    
    if (!user) {
      // 创建新用户
      user = {
        id: userIdCounter++,
        phone,
        nickname: `用户${phone.slice(-4)}`,
        avatar: '',
        gender: '',
        birthday: '',
        height: 0,
        weight: 0,
        targetWeight: 0,
        signature: '',
        vipLevel: 0,
        vipExpireDate: null,
        points: 0,
      };
      users.set(phone, user);
    }

    // 生成JWT
    const token = jwt.sign(
      { userId: user.id, phone: user.phone },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        gender: user.gender,
        birthday: user.birthday,
        height: user.height,
        weight: user.weight,
        targetWeight: user.targetWeight,
        signature: user.signature,
        vipLevel: user.vipLevel,
        vipExpireDate: user.vipExpireDate,
        points: user.points,
      },
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

// 获取当前用户信息
router.get('/me', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未登录' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; phone: string };

    const user = users.get(decoded.phone);
    
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
      id: user.id,
      phone: user.phone,
      nickname: user.nickname,
      avatar: user.avatar,
      gender: user.gender,
      birthday: user.birthday,
      height: user.height,
      weight: user.weight,
      targetWeight: user.targetWeight,
      signature: user.signature,
      vipLevel: user.vipLevel,
      vipExpireDate: user.vipExpireDate,
      points: user.points,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Token无效' });
    }
    console.error('获取用户信息失败:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 更新用户信息
router.put('/profile', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未登录' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; phone: string };

    const { nickname, avatar, gender, birthday, height, weight, targetWeight, signature } = req.body;

    const user = users.get(decoded.phone);
    
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 更新用户信息
    if (nickname !== undefined) user.nickname = nickname;
    if (avatar !== undefined) user.avatar = avatar;
    if (gender !== undefined) user.gender = gender;
    if (birthday !== undefined) user.birthday = birthday;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (targetWeight !== undefined) user.targetWeight = targetWeight;
    if (signature !== undefined) user.signature = signature;

    res.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        gender: user.gender,
        birthday: user.birthday,
        height: user.height,
        weight: user.weight,
        targetWeight: user.targetWeight,
        signature: user.signature,
        vipLevel: user.vipLevel,
        vipExpireDate: user.vipExpireDate,
        points: user.points,
      },
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Token无效' });
    }
    console.error('更新用户信息失败:', error);
    res.status(500).json({ error: '更新用户信息失败' });
  }
});

// 退出登录
router.post('/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: '已退出登录' });
});

export default router;
