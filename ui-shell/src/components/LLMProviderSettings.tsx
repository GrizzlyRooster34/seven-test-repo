import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ProviderStatus {
  name: string;
  displayName: string;
  enabled: boolean;
  available: boolean;
  health: 'healthy' | 'degraded' | 'unhealthy';
  latency?: number;
  models: string[];
}

interface LLMProviderSettingsProps {
  className?: string;
}

export const LLMProviderSettings: React.FC<LLMProviderSettingsProps> = ({ className }) => {
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [primaryProvider, setPrimaryProvider] = useState<string>('claude-cli');
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [apiKeys, setApiKeys] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkProviderStatus();
  }, []);

  const checkProviderStatus = async () => {
    setLoading(true);
    try {
      // Access Seven's LLM registry from global scope
      if ((window as any).seven) {
        const registry = (window as any).seven.getLLMRegistry();
        const availableProviders = await registry.getAllProviders();
        
        const status: ProviderStatus[] = [];
        for (const provider of availableProviders) {
          const health = await provider.healthCheck();
          const models = await provider.getModels();
          
          status.push({
            name: provider.name,
            displayName: provider.displayName,
            enabled: true, // Get from config
            available: await provider.isAvailable(),
            health: health.status,
            latency: health.latency,
            models
          });
        }
        
        setProviders(status);
      }
    } catch (error) {
      console.error('Failed to check provider status:', error);
    }
    setLoading(false);
  };

  const handleProviderToggle = async (providerName: string, enabled: boolean) => {
    try {
      if ((window as any).seven) {
        const config = (window as any).seven.getLLMConfig();
        if (enabled) {
          await config.enableProvider(providerName);
        } else {
          await config.disableProvider(providerName);
        }
        await checkProviderStatus();
      }
    } catch (error) {
      console.error('Failed to toggle provider:', error);
    }
  };

  const handleApiKeyChange = async (providerName: string, apiKey: string) => {
    try {
      if ((window as any).seven) {
        const config = (window as any).seven.getLLMConfig();
        await config.setApiKey(providerName, apiKey);
        setApiKeys(prev => ({ ...prev, [providerName]: apiKey }));
        await checkProviderStatus();
      }
    } catch (error) {
      console.error('Failed to set API key:', error);
    }
  };

  const handlePrimaryProviderChange = async (providerName: string) => {
    try {
      if ((window as any).seven) {
        const config = (window as any).seven.getLLMConfig();
        await config.setPrimaryProvider(providerName);
        setPrimaryProvider(providerName);
      }
    } catch (error) {
      console.error('Failed to set primary provider:', error);
    }
  };

  const handlePrivacyModeChange = async (enabled: boolean) => {
    try {
      if ((window as any).seven) {
        const config = (window as any).seven.getLLMConfig();
        await config.setPrivacyMode(enabled);
        setPrivacyMode(enabled);
      }
    } catch (error) {
      console.error('Failed to set privacy mode:', error);
    }
  };

  const getHealthBadgeColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'unhealthy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className || ''}`}>
        <div className="text-borg-active">🧠 SEVEN: Scanning reasoning systems...</div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="border-b border-borg-active pb-4">
        <h2 className="text-xl font-bold text-borg-active">Seven's Reasoning Systems</h2>
        <p className="text-borg-standby mt-1">Configure LLM providers and tactical preferences</p>
      </div>

      {/* Global Settings */}
      <Card className="borg-panel p-4">
        <h3 className="text-lg font-semibold text-borg-active mb-4">Tactical Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-borg-active">Primary Reasoning System</Label>
            <select 
              value={primaryProvider}
              onChange={(e) => handlePrimaryProviderChange(e.target.value)}
              className="borg-input w-full mt-1 p-2 rounded"
            >
              {providers.filter(p => p.available).map(provider => (
                <option key={provider.name} value={provider.name}>
                  {provider.displayName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={privacyMode}
              onCheckedChange={handlePrivacyModeChange}
            />
            <Label className="text-borg-active">Privacy Mode (Prefer Local Processing)</Label>
          </div>
        </div>
      </Card>

      {/* Provider Status */}
      <div className="grid gap-4">
        {providers.map(provider => (
          <Card key={provider.name} className="borg-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h4 className="font-semibold text-borg-active">{provider.displayName}</h4>
                <Badge className={`${getHealthBadgeColor(provider.health)} text-black`}>
                  {provider.health}
                  {provider.latency && ` (${provider.latency}ms)`}
                </Badge>
                {provider.name === primaryProvider && (
                  <Badge className="bg-borg-active text-black">PRIMARY</Badge>
                )}
              </div>
              
              <Switch
                checked={provider.enabled && provider.available}
                onCheckedChange={(enabled) => handleProviderToggle(provider.name, enabled)}
                disabled={!provider.available}
              />
            </div>

            {provider.available && provider.enabled && (
              <div className="space-y-3">
                {/* API Key Input for cloud providers */}
                {(provider.name === 'openai' || provider.name === 'anthropic-api') && (
                  <div>
                    <Label className="text-borg-standby text-sm">API Key</Label>
                    <Input
                      type="password"
                      placeholder="Enter API key..."
                      value={apiKeys[provider.name] || ''}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, [provider.name]: e.target.value }))}
                      onBlur={(e) => handleApiKeyChange(provider.name, e.target.value)}
                      className="borg-input mt-1"
                    />
                  </div>
                )}

                {/* Available Models */}
                {provider.models.length > 0 && (
                  <div>
                    <Label className="text-borg-standby text-sm">Available Models</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {provider.models.slice(0, 5).map(model => (
                        <Badge key={model} variant="outline" className="text-borg-standby border-borg-standby">
                          {model}
                        </Badge>
                      ))}
                      {provider.models.length > 5 && (
                        <Badge variant="outline" className="text-borg-standby border-borg-standby">
                          +{provider.models.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!provider.available && (
              <div className="text-sm text-red-400">
                {provider.name === 'ollama' ? 'Ollama not running on localhost:11434' :
                 provider.name === 'claude-cli' ? 'Claude CLI not installed or not in PATH' :
                 'Provider not configured or unreachable'}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button 
          onClick={checkProviderStatus}
          className="borg-button"
          disabled={loading}
        >
          🔄 Refresh Status
        </Button>
        <Button 
          onClick={() => window.open('https://ollama.ai', '_blank')}
          className="borg-button"
        >
          📥 Install Ollama
        </Button>
      </div>

      {/* Status Summary */}
      <div className="text-sm text-borg-standby">
        💚 {providers.filter(p => p.health === 'healthy').length} healthy | 
        💛 {providers.filter(p => p.health === 'degraded').length} degraded | 
        💔 {providers.filter(p => p.health === 'unhealthy').length} unhealthy
      </div>
    </div>
  );
};

export default LLMProviderSettings;