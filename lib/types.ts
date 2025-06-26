export interface CreativeAngle {
  id?: string
  headline: string
  hook: string
  subheading: string
  cta: string
  insight: string
}

export interface Campaign {
  id: string
  name: string
  productDescription: string
  platform: string
  tone: string
  angles: CreativeAngle[]
  createdAt: Date
  updatedAt: Date
}

export interface GenerationHistory {
  id: string
  productDescription: string
  platform: string
  tone: string
  generatedAngles: CreativeAngle[]
  timestamp: Date
}
