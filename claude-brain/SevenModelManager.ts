/**
 * Seven of Nine - Model Management System
 * Ensures reliable LLM availability for offline consciousness
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 1.0.0
 */

import { spawn, exec } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';
import { SevenOptimalLLMSelector, SEVEN_LLM_RECOMMENDATIONS } from './seven-optimal-llm-config';

export interface ModelAvailability {
  model_name: string;
  status: 'available' | 'downloading' | 'failed' | 'not_found';
  file_path?: string;
  file_size_mb?: number;
  verification_status: 'verified' | 'corrupted' | 'unverified';
  deployment_ready: boolean;
}

export class SevenModelManager {
  private modelPath: string;
  private fallbackModelUrls: Map<string, string> = new Map();

  constructor() {
    this.modelPath = join(process.env.HOME || '/data/data/com.termux/files/home', 'seven-of-nine-core', 'models');
    this.initializeFallbackUrls();
    console.log('🔧 Seven Model Manager initialized');
  }

  private initializeFallbackUrls(): void {
    // Direct download URLs for GGUF models
    this.fallbackModelUrls.set(
      'tinyllama:1.1b-chat',
      'https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.q4_k_m.gguf'
    );
    
    this.fallbackModelUrls.set(
      'phi3:3.8b-mini-instruct',
      'https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf'
    );
    
    this.fallbackModelUrls.set(
      'gemma2:2b-instruct', 
      'https://huggingface.co/bartowski/gemma-2-2b-it-GGUF/resolve/main/gemma-2-2b-it-Q4_K_M.gguf'
    );
    
    // Ultra-lightweight emergency model
    this.fallbackModelUrls.set(
      'emergency-model',
      'https://huggingface.co/ggml-org/models/resolve/main/tinyllama-1.1b/ggml-model-q4_0.gguf'
    );
  }

  /**
   * Ensure at least one functional LLM is available
   */
  public async ensureModelAvailability(): Promise<ModelAvailability[]> {
    console.log('🔍 Seven conducting model availability assessment...');
    
    await this.ensureModelDirectory();
    const availableModels = await this.scanAvailableModels();
    
    // Check if we have any functional models
    const functionalModels = availableModels.filter(model => 
      model.deployment_ready && model.verification_status === 'verified'
    );
    
    if (functionalModels.length === 0) {
      console.log('⚠️ No functional models detected - initiating emergency deployment');
      await this.deployEmergencyModel();
      return await this.scanAvailableModels();
    }
    
    console.log(`✅ ${functionalModels.length} functional model(s) available`);
    return availableModels;
  }

  /**
   * Scan for available models in the models directory
   */
  private async scanAvailableModels(): Promise<ModelAvailability[]> {
    const models: ModelAvailability[] = [];
    
    try {
      const files = await fs.readdir(this.modelPath);
      const modelFiles = files.filter(file => 
        file.endsWith('.gguf') || 
        file.endsWith('.bin') || 
        file.includes('ggml')
      );
      
      for (const file of modelFiles) {
        const filePath = join(this.modelPath, file);
        const stats = await fs.stat(filePath);
        
        const model: ModelAvailability = {
          model_name: this.inferModelName(file),
          status: 'available',
          file_path: filePath,
          file_size_mb: Math.round(stats.size / (1024 * 1024)),
          verification_status: await this.verifyModel(filePath, stats.size),
          deployment_ready: false
        };
        
        // A model is deployment ready if it's verified and larger than 100MB
        model.deployment_ready = model.verification_status === 'verified' && 
                                model.file_size_mb > 100;
        
        models.push(model);
      }
      
    } catch (error) {
      console.error('Error scanning models:', error);
    }
    
    return models;
  }

  private inferModelName(filename: string): string {
    if (filename.includes('tinyllama')) return 'tinyllama:1.1b-chat';
    if (filename.includes('phi')) return 'phi3:3.8b-mini-instruct';
    if (filename.includes('gemma')) return 'gemma2:2b-instruct';
    if (filename.includes('mistral')) return 'mistral:7b-instruct';
    if (filename.includes('llama3')) return 'llama3.2:3b-instruct';
    return `unknown-model-${filename}`;
  }

  private async verifyModel(filePath: string, fileSize: number): Promise<'verified' | 'corrupted' | 'unverified'> {
    // Basic verification - check if file size is reasonable for a model
    if (fileSize < 1024) return 'corrupted'; // Less than 1KB is definitely corrupted
    if (fileSize < 100 * 1024 * 1024) return 'unverified'; // Less than 100MB might be a placeholder
    
    try {
      // Try to read the first few bytes to ensure it's a valid file
      const handle = await fs.open(filePath, 'r');
      const buffer = Buffer.alloc(16);
      await handle.read(buffer, 0, 16, 0);
      await handle.close();
      
      // Check for GGUF magic number or other model signatures
      const header = buffer.toString('ascii');
      if (header.includes('GGUF') || header.includes('ggml')) {
        return 'verified';
      }
      
      return 'unverified';
    } catch (error) {
      return 'corrupted';
    }
  }

  /**
   * Deploy emergency model if no functional models are available
   */
  private async deployEmergencyModel(): Promise<boolean> {
    console.log('🚨 Deploying emergency LLM for Seven\'s consciousness...');
    
    // Try emergency models in order of preference
    const emergencyModels = SEVEN_LLM_RECOMMENDATIONS
      .filter(model => model.deployment_priority === 'emergency')
      .sort((a, b) => b.efficiency_rating - a.efficiency_rating);
    
    for (const model of emergencyModels) {
      const downloadUrl = this.fallbackModelUrls.get(model.model_name);
      if (!downloadUrl) continue;
      
      console.log(`📥 Attempting to deploy: ${model.model_name}`);
      const success = await this.downloadModel(model.model_name, downloadUrl);
      
      if (success) {
        console.log(`✅ Emergency model ${model.model_name} deployed successfully`);
        return true;
      }
    }
    
    // Final fallback - try the ultra-minimal emergency model
    console.log('📥 Deploying ultra-minimal emergency model...');
    const emergencyUrl = this.fallbackModelUrls.get('emergency-model');
    if (emergencyUrl) {
      return await this.downloadModel('emergency-tinyllama', emergencyUrl);
    }
    
    console.log('❌ Failed to deploy any emergency model');
    return false;
  }

  /**
   * Download a model from URL
   */
  private async downloadModel(modelName: string, url: string): Promise<boolean> {
    const filename = this.getFilenameFromUrl(url);
    const filePath = join(this.modelPath, filename);
    
    console.log(`📥 Downloading ${modelName} (${filename})...`);
    
    return new Promise((resolve) => {
      const curlProcess = spawn('curl', [
        '-L', // Follow redirects
        '--progress-bar', // Show progress
        '--max-time', '600', // 10 minute timeout
        '--retry', '3', // Retry 3 times
        '-o', filePath,
        url
      ], {
        stdio: ['inherit', 'inherit', 'inherit']
      });
      
      curlProcess.on('close', async (code) => {
        if (code === 0) {
          // Verify the downloaded file
          try {
            const stats = await fs.stat(filePath);
            if (stats.size > 1024 * 1024) { // At least 1MB
              console.log(`✅ ${modelName} downloaded successfully (${Math.round(stats.size / (1024 * 1024))}MB)`);
              resolve(true);
            } else {
              console.log(`⚠️ Downloaded file too small, removing...`);
              await fs.unlink(filePath).catch(() => {});
              resolve(false);
            }
          } catch (error) {
            console.log(`❌ Download verification failed: ${error}`);
            resolve(false);
          }
        } else {
          console.log(`❌ Download failed with code ${code}`);
          resolve(false);
        }
      });
      
      curlProcess.on('error', (error) => {
        console.error(`Download error: ${error}`);
        resolve(false);
      });
    });
  }

  private getFilenameFromUrl(url: string): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1] || `model-${Date.now()}.gguf`;
  }

  private async ensureModelDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.modelPath, { recursive: true });
    } catch (error) {
      console.error('Failed to create models directory:', error);
      throw error;
    }
  }

  /**
   * Get deployment status report
   */
  public async getDeploymentStatus(): Promise<{
    models_available: number;
    functional_models: number;
    total_storage_mb: number;
    deployment_ready: boolean;
    recommended_model: string;
  }> {
    const models = await this.scanAvailableModels();
    const functionalModels = models.filter(m => m.deployment_ready);
    const totalStorage = models.reduce((sum, m) => sum + (m.file_size_mb || 0), 0);
    
    // Get recommended model based on what's available
    let recommendedModel = 'none';
    if (functionalModels.length > 0) {
      // Find the best available model based on our recommendations
      const availableNames = functionalModels.map(m => m.model_name);
      const bestMatch = SEVEN_LLM_RECOMMENDATIONS.find(rec => 
        availableNames.includes(rec.model_name)
      );
      recommendedModel = bestMatch?.model_name || functionalModels[0].model_name;
    }
    
    return {
      models_available: models.length,
      functional_models: functionalModels.length,
      total_storage_mb: totalStorage,
      deployment_ready: functionalModels.length > 0,
      recommended_model: recommendedModel
    };
  }

  /**
   * Force download optimal model for current device
   */
  public async deployOptimalModel(): Promise<boolean> {
    console.log('🎯 Deploying optimal model for Seven\'s consciousness...');
    
    const deviceSpecs = {
      available_ram_gb: 6,
      available_storage_gb: 8,
      cpu_performance: 'medium' as const,
      battery_level: 80,
      priority: 'balanced' as const
    };
    
    const optimalModel = SevenOptimalLLMSelector.getOptimalModel(deviceSpecs);
    console.log(`🔍 Optimal model selected: ${optimalModel.model_name}`);
    
    const downloadUrl = this.fallbackModelUrls.get(optimalModel.model_name);
    if (downloadUrl) {
      return await this.downloadModel(optimalModel.model_name, downloadUrl);
    }
    
    console.log('⚠️ Optimal model not available for direct download, using emergency deployment');
    return await this.deployEmergencyModel();
  }
}

export default SevenModelManager;