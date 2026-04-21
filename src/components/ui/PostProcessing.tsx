import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useSimStore } from '../../store/useSimStore'

export function PostProcessing() {
  const { weatherIntensity, zoomLevel } = useSimStore()
  
  // Dynamic bloom based on level and atmosphere
  const bloomIntensity = zoomLevel === 'atomic' ? 2.5 : 1.2
  const bloomLuminanceThreshold = zoomLevel === 'atomic' ? 0.2 : 0.85
  
  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={bloomLuminanceThreshold} 
        mipmapBlur 
        intensity={bloomIntensity} 
        radius={0.4}
      />
      <Noise 
        opacity={0.05 + weatherIntensity * 0.1} 
        blendFunction={BlendFunction.OVERLAY} 
      />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0005, 0.0005] as [number, number]}
      />
    </EffectComposer>
  )
}
